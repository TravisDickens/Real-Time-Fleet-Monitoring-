package com.fleetmonitoring.controller;

import com.fleetmonitoring.model.Alert;
import com.fleetmonitoring.model.AlertType;
import com.fleetmonitoring.service.AlertService;
import com.fleetmonitoring.websocket.WebSocketBroadcaster;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;
    private final WebSocketBroadcaster broadcaster;

    @GetMapping
    public List<Alert> getAlerts(
            @RequestParam(required = false) AlertType type,
            @RequestParam(defaultValue = "100") int limit) {
        if (type != null) {
            return alertService.getByType(type, limit);
        }
        return alertService.getRecent(limit);
    }

    @GetMapping("/{vehicleId}")
    public List<Alert> getAlertsByVehicle(@PathVariable String vehicleId) {
        return alertService.getByVehicleId(vehicleId);
    }

    @MessageMapping("/toggleAlerts")
    public void toggleAlerts(@Payload Map<String, Boolean> payload) {
        Boolean enabled = payload.get("enabled");
        if (enabled != null) {
            broadcaster.setAlertsEnabled(enabled);
        }
    }
}
