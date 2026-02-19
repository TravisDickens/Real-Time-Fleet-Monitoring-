package com.fleetmonitoring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "telemetry", indexes = {
        @Index(name = "idx_telemetry_vehicle_id", columnList = "vehicleId"),
        @Index(name = "idx_telemetry_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleId;

    private double latitude;
    private double longitude;
    private double speed;
    private double fuelLevel;
    private double engineTemp;

    @Column(nullable = false)
    private Instant timestamp;
}
