import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../types';
import { SPEED_LIMIT, FUEL_WARNING, TEMP_WARNING } from '../utils/constants';

type Status = 'normal' | 'warning' | 'critical';

const SA_PROVINCES: Record<string, string> = {
  GP: 'Gauteng',
  NW: 'North West',
  MP: 'Mpumalanga',
  LP: 'Limpopo',
  KZN: 'KwaZulu-Natal',
  WC: 'Western Cape',
  EC: 'Eastern Cape',
  FS: 'Free State',
  NC: 'Northern Cape',
};

function getStatus(v: Vehicle): Status {
  const isCritical = v.lastSpeed > 140 || v.lastFuelLevel < 10 || v.lastEngineTemp > 110;
  const isWarning = v.lastSpeed > SPEED_LIMIT || v.lastFuelLevel < FUEL_WARNING || v.lastEngineTemp > TEMP_WARNING;
  if (isCritical) return 'critical';
  if (isWarning) return 'warning';
  return 'normal';
}

function getProvince(vehicleId: string): string {
  const code = vehicleId.split(' ')[0];
  return SA_PROVINCES[code] || code;
}

function createIcon(status: Status) {
  if (status === 'critical') {
    return L.divIcon({
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      html: `<div style="position:relative;width:20px;height:20px;">
        <div class="marker-ping" style="position:absolute;inset:0;border-radius:50%;background:rgba(239,68,68,0.3);"></div>
        <div style="position:absolute;top:5px;left:5px;width:10px;height:10px;border-radius:50%;background:#ef4444;box-shadow:0 0 8px rgba(239,68,68,0.6);"></div>
      </div>`,
    });
  }
  if (status === 'warning') {
    return L.divIcon({
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      html: `<div style="position:relative;width:16px;height:16px;">
        <div style="position:absolute;inset:1px;border-radius:50%;border:1.5px solid rgba(245,158,11,0.5);"></div>
        <div style="position:absolute;top:4px;left:4px;width:8px;height:8px;border-radius:50%;background:#f59e0b;"></div>
      </div>`,
    });
  }
  return L.divIcon({
    className: '',
    iconSize: [8, 8],
    iconAnchor: [4, 4],
    html: `<div style="width:8px;height:8px;border-radius:50%;background:rgba(100,116,139,0.7);"></div>`,
  });
}

interface Props {
  vehicle: Vehicle;
}

export default function VehicleMarker({ vehicle }: Props) {
  const status = getStatus(vehicle);
  const icon = createIcon(status);
  const province = getProvince(vehicle.vehicleId);

  return (
    <Marker position={[vehicle.lastLatitude, vehicle.lastLongitude]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 160 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 600, marginBottom: 2, color: '#f1f5f9' }}>
            {vehicle.vehicleId}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: 8 }}>{province}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Speed</span>
              <span style={{ color: vehicle.lastSpeed > SPEED_LIMIT ? '#ef4444' : '#e2e8f0', fontWeight: 500 }}>{vehicle.lastSpeed.toFixed(1)} km/h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Fuel</span>
              <span style={{ color: vehicle.lastFuelLevel < FUEL_WARNING ? '#f59e0b' : '#e2e8f0', fontWeight: 500 }}>{vehicle.lastFuelLevel.toFixed(1)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Engine</span>
              <span style={{ color: vehicle.lastEngineTemp > TEMP_WARNING ? '#f97316' : '#e2e8f0', fontWeight: 500 }}>{vehicle.lastEngineTemp.toFixed(1)}&deg;C</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
