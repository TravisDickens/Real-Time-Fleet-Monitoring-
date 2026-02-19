package com.fleetmonitoring.simulator;

import com.fleetmonitoring.alert.AlertEngine;
import com.fleetmonitoring.model.Alert;
import com.fleetmonitoring.model.Telemetry;
import com.fleetmonitoring.model.Vehicle;
import com.fleetmonitoring.service.AlertService;
import com.fleetmonitoring.service.TelemetryService;
import com.fleetmonitoring.service.VehicleService;
import com.fleetmonitoring.websocket.WebSocketBroadcaster;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
@Slf4j
public class VehicleSimulator {

    private final VehicleService vehicleService;
    private final TelemetryService telemetryService;
    private final AlertService alertService;
    private final AlertEngine alertEngine;
    private final WebSocketBroadcaster broadcaster;

    @Value("${fleet.simulator.vehicle-count:500}")
    private int vehicleCount;

    @Value("${fleet.simulator.region.center-lat:-26.20}")
    private double centerLat;

    @Value("${fleet.simulator.region.center-lng:28.04}")
    private double centerLng;

    @Value("${fleet.simulator.region.spread-lat:0.12}")
    private double spreadLat;

    @Value("${fleet.simulator.region.spread-lng:0.18}")
    private double spreadLng;

    private final Map<String, VehicleState> vehicleStates = new ConcurrentHashMap<>();

    private static final String[] PROVINCE_CODES = {"GP", "NW", "MP", "LP", "KZN", "WC", "EC", "FS", "NC"};
    private static final double[] PROVINCE_WEIGHTS = {0.70, 0.05, 0.05, 0.03, 0.05, 0.04, 0.03, 0.03, 0.02};

    @PostConstruct
    public void init() {
        List<Vehicle> existing = vehicleService.findAll();
        if (existing.size() >= vehicleCount) {
            existing.forEach(v -> vehicleStates.put(v.getVehicleId(), new VehicleState(
                    v.getVehicleId(), v.getLastLatitude(), v.getLastLongitude(),
                    v.getLastSpeed(), v.getLastFuelLevel(), v.getLastEngineTemp())));
            log.info("Loaded {} existing vehicles from database", existing.size());
            return;
        }

        log.info("Initializing {} vehicles in the Gauteng region", vehicleCount);
        ThreadLocalRandom rng = ThreadLocalRandom.current();
        List<Vehicle> vehicles = new ArrayList<>(vehicleCount);
        Set<String> usedPlates = new HashSet<>();

        for (int i = 0; i < vehicleCount; i++) {
            String plate = generatePlate(rng, usedPlates);
            double lat = centerLat + (rng.nextDouble() - 0.5) * 2 * spreadLat;
            double lng = centerLng + (rng.nextDouble() - 0.5) * 2 * spreadLng;
            double speed = 30 + rng.nextDouble() * 70;
            double fuel = 40 + rng.nextDouble() * 60;
            double temp = 75 + rng.nextDouble() * 15;

            vehicleStates.put(plate, new VehicleState(plate, lat, lng, speed, fuel, temp));
            vehicles.add(Vehicle.builder()
                    .vehicleId(plate)
                    .lastLatitude(lat).lastLongitude(lng)
                    .lastSpeed(speed).lastFuelLevel(fuel).lastEngineTemp(temp)
                    .lastUpdated(Instant.now())
                    .build());
        }

        vehicleService.saveAll(vehicles);
        log.info("Saved {} vehicles to database", vehicleCount);
    }

    private String generatePlate(ThreadLocalRandom rng, Set<String> used) {
        String plate;
        do {
            String province = pickProvince(rng);
            int digits = rng.nextInt(100, 1000);
            char c1 = (char) ('A' + rng.nextInt(26));
            char c2 = (char) ('A' + rng.nextInt(26));
            char c3 = (char) ('A' + rng.nextInt(26));
            plate = String.format("%s %03d %c%c%c", province, digits, c1, c2, c3);
        } while (used.contains(plate));
        used.add(plate);
        return plate;
    }

    private String pickProvince(ThreadLocalRandom rng) {
        double r = rng.nextDouble();
        double cumulative = 0;
        for (int i = 0; i < PROVINCE_CODES.length; i++) {
            cumulative += PROVINCE_WEIGHTS[i];
            if (r < cumulative) return PROVINCE_CODES[i];
        }
        return PROVINCE_CODES[0];
    }

    @Scheduled(fixedRateString = "${fleet.simulator.tick-interval-ms:1000}")
    public void simulateTick() {
        Instant now = Instant.now();
        List<Telemetry> telemetryBatch = new ArrayList<>(vehicleStates.size());
        List<Alert> alertBatch = new ArrayList<>();

        for (VehicleState state : vehicleStates.values()) {
            state.evolve();

            Telemetry t = Telemetry.builder()
                    .vehicleId(state.vehicleId)
                    .latitude(state.latitude)
                    .longitude(state.longitude)
                    .speed(state.speed)
                    .fuelLevel(state.fuelLevel)
                    .engineTemp(state.engineTemp)
                    .timestamp(now)
                    .build();

            telemetryBatch.add(t);
            alertBatch.addAll(alertEngine.evaluate(t));
        }

        telemetryService.saveAll(telemetryBatch);

        for (VehicleState state : vehicleStates.values()) {
            vehicleService.updateVehicleState(
                    state.vehicleId, state.latitude, state.longitude,
                    state.speed, state.fuelLevel, state.engineTemp);
        }

        if (!alertBatch.isEmpty()) {
            alertService.saveAll(alertBatch);
        }

        broadcaster.broadcastTelemetryBatch(telemetryBatch);
        alertBatch.forEach(broadcaster::broadcastAlert);
    }

    static class VehicleState {
        final String vehicleId;
        double latitude;
        double longitude;
        double speed;
        double fuelLevel;
        double engineTemp;
        double heading;
        double targetSpeed;
        int stopTicks;

        VehicleState(String vehicleId, double lat, double lng,
                     double speed, double fuel, double temp) {
            this.vehicleId = vehicleId;
            this.latitude = lat;
            this.longitude = lng;
            this.speed = speed;
            this.fuelLevel = fuel;
            this.engineTemp = temp;
            this.heading = ThreadLocalRandom.current().nextDouble() * 2 * Math.PI;
            this.targetSpeed = speed;
            this.stopTicks = 0;
        }

        void evolve() {
            ThreadLocalRandom rng = ThreadLocalRandom.current();

            if (stopTicks > 0) {
                stopTicks--;
                speed = Math.max(0, speed * 0.7);
                engineTemp += (75 - engineTemp) * 0.1 + (rng.nextDouble() - 0.5) * 0.5;
                engineTemp = Math.max(60, Math.min(125, engineTemp));
                fuelLevel -= 0.005 + rng.nextDouble() * 0.01;
                if (fuelLevel < 5) fuelLevel = 80 + rng.nextDouble() * 20;
                return;
            }
            if (rng.nextDouble() < 0.03) {
                stopTicks = 5 + rng.nextInt(11);
                return;
            }

            double steerAmount = 0.15 / (1 + speed * 0.01);
            heading += (rng.nextDouble() - 0.5) * 2 * steerAmount;

            if (rng.nextDouble() < 0.05) {
                heading += (rng.nextDouble() - 0.5) * Math.PI * 0.5;
            }

            double speedKmH = Math.max(speed, 0);
            double distanceDeg = (speedKmH / 3600.0) * 0.009;
            latitude += Math.cos(heading) * distanceDeg;
            longitude += Math.sin(heading) * distanceDeg;

            if (rng.nextDouble() < 0.1) {
                targetSpeed = 20 + rng.nextDouble() * 120;
            }
            speed += (targetSpeed - speed) * (0.05 + rng.nextDouble() * 0.1);
            speed += (rng.nextDouble() - 0.5) * 3;
            speed = Math.max(0, Math.min(160, speed));

            double consumption = 0.01 + (speed / 160.0) * 0.07 + rng.nextDouble() * 0.02;
            fuelLevel -= consumption;
            if (fuelLevel < 5) {
                fuelLevel = 80 + rng.nextDouble() * 20;
            }

            double baseTemp = 72 + (speed / 160.0) * 25;
            engineTemp += (baseTemp - engineTemp) * 0.08 + (rng.nextDouble() - 0.5) * 2;
            if (rng.nextDouble() < 0.015) {
                engineTemp += 12 + rng.nextDouble() * 10;
            }
            engineTemp = Math.max(60, Math.min(125, engineTemp));
        }
    }
}
