package com.fleetmonitoring.repository;

import com.fleetmonitoring.model.Alert;
import com.fleetmonitoring.model.AlertType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByVehicleIdOrderByTimestampDesc(String vehicleId);

    List<Alert> findByAlertTypeOrderByTimestampDesc(AlertType alertType, Pageable pageable);

    List<Alert> findAllByOrderByTimestampDesc(Pageable pageable);
}
