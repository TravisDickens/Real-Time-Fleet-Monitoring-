import { MapContainer, TileLayer } from 'react-leaflet';
import { useFleetStore } from '../store/useFleetStore';
import VehicleMarker from './VehicleMarker';
import { MAP_CENTER, MAP_ZOOM } from '../utils/constants';

export default function FleetMap() {
  const vehicles = useFleetStore((s) => s.vehicles);
  const vehicleList = Array.from(vehicles.values());

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="h-full w-full rounded-lg"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {vehicleList.map((v) => (
        <VehicleMarker key={v.vehicleId} vehicle={v} />
      ))}
    </MapContainer>
  );
}
