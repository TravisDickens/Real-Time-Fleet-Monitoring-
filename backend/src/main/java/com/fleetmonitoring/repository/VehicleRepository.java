package com.fleetmonitoring.repository;

import com.fleetmonitoring.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleId(String vehicleId);

    @Modifying
    @Query("UPDATE Vehicle v SET v.lastLatitude = :lat, v.lastLongitude = :lng, " +
            "v.lastSpeed = :speed, v.lastFuelLevel = :fuel, v.lastEngineTemp = :temp, " +
            "v.lastUpdated = :updated WHERE v.vehicleId = :vehicleId")
    void updateVehicleState(@Param("vehicleId") String vehicleId,
                            @Param("lat") double lat,
                            @Param("lng") double lng,
                            @Param("speed") double speed,
                            @Param("fuel") double fuel,
                            @Param("temp") double temp,
                            @Param("updated") Instant updated);
}
