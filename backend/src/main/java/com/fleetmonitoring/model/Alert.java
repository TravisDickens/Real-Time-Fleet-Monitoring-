package com.fleetmonitoring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "alerts", indexes = {
        @Index(name = "idx_alerts_vehicle_id", columnList = "vehicleId"),
        @Index(name = "idx_alerts_type", columnList = "alertType"),
        @Index(name = "idx_alerts_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    private String message;

    @Column(nullable = false)
    private Instant timestamp;
}
