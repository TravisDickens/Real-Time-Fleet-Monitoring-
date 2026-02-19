package com.fleetmonitoring.service;

import com.fleetmonitoring.model.Telemetry;
import com.fleetmonitoring.repository.TelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;

    @Transactional
    public void saveAll(List<Telemetry> telemetryList) {
        telemetryRepository.saveAll(telemetryList);
    }

    public List<Telemetry> getHistory(String vehicleId, int limit) {
        return telemetryRepository.findByVehicleIdOrderByTimestampDesc(
                vehicleId, PageRequest.of(0, limit));
    }

    public List<Telemetry> getHistoryBetween(String vehicleId, Instant from, Instant to) {
        return telemetryRepository.findByVehicleIdAndTimestampBetweenOrderByTimestampDesc(
                vehicleId, from, to);
    }
}
