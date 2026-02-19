package com.fleetmonitoring.service;

import com.fleetmonitoring.model.Vehicle;
import com.fleetmonitoring.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> findByVehicleId(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId);
    }

    public long count() {
        return vehicleRepository.count();
    }

    @Transactional
    public List<Vehicle> saveAll(List<Vehicle> vehicles) {
        return vehicleRepository.saveAll(vehicles);
    }

    @Transactional
    public void updateVehicleState(String vehicleId, double lat, double lng,
                                   double speed, double fuel, double temp) {
        vehicleRepository.updateVehicleState(vehicleId, lat, lng, speed, fuel, temp, Instant.now());
    }
}
