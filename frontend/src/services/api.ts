import axios from 'axios';
import type { Vehicle, Alert, TelemetryPoint } from '../types';
import { API_BASE } from '../utils/constants';

const client = axios.create({ baseURL: API_BASE });

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data } = await client.get<Vehicle[]>('/vehicles');
  return data;
}

export async function fetchVehicle(vehicleId: string): Promise<Vehicle> {
  const { data } = await client.get<Vehicle>(`/vehicles/${vehicleId}`);
  return data;
}

export async function fetchAlerts(type?: string, limit = 100): Promise<Alert[]> {
  const params: Record<string, string | number> = { limit };
  if (type) params.type = type;
  const { data } = await client.get<Alert[]>('/alerts', { params });
  return data;
}

export async function fetchTelemetry(vehicleId: string, limit = 100): Promise<TelemetryPoint[]> {
  const { data } = await client.get<TelemetryPoint[]>(`/telemetry/${vehicleId}`, {
    params: { limit },
  });
  return data;
}
