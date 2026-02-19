package com.fleetmonitoring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String vehicleId;

    private double lastLatitude;
    private double lastLongitude;
    private double lastSpeed;
    private double lastFuelLevel;
    private double lastEngineTemp;
    private Instant lastUpdated;
}
