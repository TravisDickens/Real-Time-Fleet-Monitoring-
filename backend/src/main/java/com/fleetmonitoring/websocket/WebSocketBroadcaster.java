package com.fleetmonitoring.websocket;

import com.fleetmonitoring.model.Alert;
import com.fleetmonitoring.model.Telemetry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketBroadcaster {

    private static final int BATCH_SIZE = 50;

    private final SimpMessagingTemplate messagingTemplate;
    private final AtomicBoolean alertsEnabled = new AtomicBoolean(true);

    public void broadcastTelemetryBatch(List<Telemetry> telemetryList) {
        for (int i = 0; i < telemetryList.size(); i += BATCH_SIZE) {
            int end = Math.min(i + BATCH_SIZE, telemetryList.size());
            List<Telemetry> chunk = telemetryList.subList(i, end);
            messagingTemplate.convertAndSend("/topic/vehicles", chunk);
        }
    }

    public void broadcastAlert(Alert alert) {
        if (alertsEnabled.get()) {
            messagingTemplate.convertAndSend("/topic/alerts", alert);
        }
    }

    public void setAlertsEnabled(boolean enabled) {
        alertsEnabled.set(enabled);
        log.info("Alert broadcasting {}", enabled ? "enabled" : "disabled");
    }

    public boolean isAlertsEnabled() {
        return alertsEnabled.get();
    }
}
