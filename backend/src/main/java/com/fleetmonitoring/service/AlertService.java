package com.fleetmonitoring.service;

import com.fleetmonitoring.model.Alert;
import com.fleetmonitoring.model.AlertType;
import com.fleetmonitoring.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    @Transactional
    public void saveAll(List<Alert> alerts) {
        alertRepository.saveAll(alerts);
    }

    public List<Alert> getRecent(int limit) {
        return alertRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, limit));
    }

    public List<Alert> getByType(AlertType type, int limit) {
        return alertRepository.findByAlertTypeOrderByTimestampDesc(type, PageRequest.of(0, limit));
    }

    public List<Alert> getByVehicleId(String vehicleId) {
        return alertRepository.findByVehicleIdOrderByTimestampDesc(vehicleId);
    }
}
