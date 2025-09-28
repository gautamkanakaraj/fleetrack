import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom truck icon
const truckIcon = L.divIcon({
  html: '<i class="fas fa-truck fa-2x" style="color: #1e90ff;"></i>',
  iconSize: [32, 32],
  className: 'truck-icon',
});

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13); // Center map on vehicle
    }
  }, [position, map]);
  return null;
}

function Map({ position }) {
  const defaultPosition = [51.505, -0.09]; // Fallback position

  return (
    <MapContainer
      center={position || defaultPosition}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && <Marker position={position} icon={truckIcon} />}
      <MapUpdater position={position} />
    </MapContainer>
  );
}

export default Map;