import { create } from 'zustand';
import type { Vehicle, TelemetryPoint, Alert, FleetMetrics } from '../types';
import { SPEED_LIMIT, FUEL_WARNING, TEMP_WARNING, MAX_ALERTS_DISPLAY } from '../utils/constants';

interface FleetState {
  vehicles: Map<string, Vehicle>;
  alerts: Alert[];
  alertsEnabled: boolean;
  metrics: FleetMetrics;

  setVehicles: (vehicles: Vehicle[]) => void;
  updateFromTelemetry: (batch: TelemetryPoint[]) => void;
  addAlert: (alert: Alert) => void;
  setAlerts: (alerts: Alert[]) => void;
  toggleAlerts: () => void;
}

function computeMetrics(vehicles: Map<string, Vehicle>): FleetMetrics {
  const all = Array.from(vehicles.values());
  const totalOnline = all.length;
  if (totalOnline === 0) {
    return { totalOnline: 0, averageSpeed: 0, overspeedCount: 0, lowFuelCount: 0, overheatCount: 0 };
  }
  let speedSum = 0;
  let overspeed = 0;
  let lowFuel = 0;
  let overheat = 0;
  for (const v of all) {
    speedSum += v.lastSpeed;
    if (v.lastSpeed > SPEED_LIMIT) overspeed++;
    if (v.lastFuelLevel < FUEL_WARNING) lowFuel++;
    if (v.lastEngineTemp > TEMP_WARNING) overheat++;
  }
  return {
    totalOnline: totalOnline,
    averageSpeed: Math.round((speedSum / totalOnline) * 10) / 10,
    overspeedCount: overspeed,
    lowFuelCount: lowFuel,
    overheatCount: overheat,
  };
}

export const useFleetStore = create<FleetState>((set) => ({
  vehicles: new Map(),
  alerts: [],
  alertsEnabled: true,
  metrics: { totalOnline: 0, averageSpeed: 0, overspeedCount: 0, lowFuelCount: 0, overheatCount: 0 },

  setVehicles: (vehicles) => {
    const map = new Map<string, Vehicle>();
    for (const v of vehicles) map.set(v.vehicleId, v);
    set({ vehicles: map, metrics: computeMetrics(map) });
  },

  updateFromTelemetry: (batch) =>
    set((state) => {
      const next = new Map(state.vehicles);
      for (const t of batch) {
        const existing = next.get(t.vehicleId);
        const updated: Vehicle = {
          vehicleId: t.vehicleId,
          lastLatitude: t.latitude,
          lastLongitude: t.longitude,
          lastSpeed: t.speed,
          lastFuelLevel: t.fuelLevel,
          lastEngineTemp: t.engineTemp,
          lastUpdated: t.timestamp,
        };
        next.set(t.vehicleId, updated);
      }
      return { vehicles: next, metrics: computeMetrics(next) };
    }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, MAX_ALERTS_DISPLAY),
    })),

  setAlerts: (alerts) => set({ alerts }),

  toggleAlerts: () => set((state) => ({ alertsEnabled: !state.alertsEnabled })),
}));
