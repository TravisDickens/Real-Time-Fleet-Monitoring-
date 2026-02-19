export interface Vehicle {
  vehicleId: string;
  lastLatitude: number;
  lastLongitude: number;
  lastSpeed: number;
  lastFuelLevel: number;
  lastEngineTemp: number;
  lastUpdated: string;
}

export interface TelemetryPoint {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuelLevel: number;
  engineTemp: number;
  timestamp: string;
}

export type AlertType = 'OVERSPEED' | 'LOW_FUEL' | 'ENGINE_OVERHEAT';
export type Severity = 'WARNING' | 'CRITICAL';

export interface Alert {
  id?: number;
  vehicleId: string;
  alertType: AlertType;
  severity: Severity;
  message: string;
  timestamp: string;
}

export interface FleetMetrics {
  totalOnline: number;
  averageSpeed: number;
  overspeedCount: number;
  lowFuelCount: number;
  overheatCount: number;
}
