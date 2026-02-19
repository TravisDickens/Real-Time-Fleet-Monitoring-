package com.fleetmonitoring.alert;

import com.fleetmonitoring.model.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AlertEngine {

    private static final long COOLDOWN_SECONDS = 30;

    private final Map<String, Instant> lastAlertTimes = new ConcurrentHashMap<>();

    public List<Alert> evaluate(Telemetry telemetry) {
        List<Alert> alerts = new ArrayList<>();

        if (telemetry.getSpeed() > 120) {
            Severity severity = telemetry.getSpeed() > 140 ? Severity.CRITICAL : Severity.WARNING;
            tryCreateAlert(telemetry, AlertType.OVERSPEED, severity,
                    String.format("Vehicle %s speeding at %.1f km/h", telemetry.getVehicleId(), telemetry.getSpeed()),
                    alerts);
        }

        if (telemetry.getFuelLevel() < 15) {
            Severity severity = telemetry.getFuelLevel() < 10 ? Severity.CRITICAL : Severity.WARNING;
            tryCreateAlert(telemetry, AlertType.LOW_FUEL, severity,
                    String.format("Vehicle %s fuel low at %.1f%%", telemetry.getVehicleId(), telemetry.getFuelLevel()),
                    alerts);
        }

        if (telemetry.getEngineTemp() > 100) {
            Severity severity = telemetry.getEngineTemp() > 110 ? Severity.CRITICAL : Severity.WARNING;
            tryCreateAlert(telemetry, AlertType.ENGINE_OVERHEAT, severity,
                    String.format("Vehicle %s engine at %.1f\u00B0C", telemetry.getVehicleId(), telemetry.getEngineTemp()),
                    alerts);
        }

        return alerts;
    }

    private void tryCreateAlert(Telemetry t, AlertType type, Severity severity,
                                String message, List<Alert> alerts) {
        String key = t.getVehicleId() + ":" + type;
        Instant now = Instant.now();
        Instant lastAlert = lastAlertTimes.get(key);

        if (lastAlert == null || Duration.between(lastAlert, now).getSeconds() >= COOLDOWN_SECONDS) {
            lastAlertTimes.put(key, now);
            alerts.add(Alert.builder()
                    .vehicleId(t.getVehicleId())
                    .alertType(type)
                    .severity(severity)
                    .message(message)
                    .timestamp(now)
                    .build());
        }
    }
}
