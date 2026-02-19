package com.fleetmonitoring.controller;

import com.fleetmonitoring.model.Telemetry;
import com.fleetmonitoring.service.TelemetryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryService telemetryService;

    @GetMapping("/{vehicleId}")
    public List<Telemetry> getTelemetry(
            @PathVariable String vehicleId,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(defaultValue = "100") int limit) {
        if (from != null && to != null) {
            return telemetryService.getHistoryBetween(vehicleId, from, to);
        }
        return telemetryService.getHistory(vehicleId, limit);
    }
}
