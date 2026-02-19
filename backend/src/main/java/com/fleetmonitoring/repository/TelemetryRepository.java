package com.fleetmonitoring.repository;

import com.fleetmonitoring.model.Telemetry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {

    List<Telemetry> findByVehicleIdOrderByTimestampDesc(String vehicleId, Pageable pageable);

    List<Telemetry> findByVehicleIdAndTimestampBetweenOrderByTimestampDesc(
            String vehicleId, Instant from, Instant to);
}
