package com.fleetmonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FleetMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(FleetMonitoringApplication.class, args);
    }
}
