import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
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
      map.setView(position, 15); // Center map on vehicle
    }
  }, [position, map]);
  return null;
}

function Map({ position }) {
  const defaultPosition = [51.505, -0.09]; // Fallback position
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (position) {
      setRoute((prevRoute) => [...prevRoute, position]); // Add new point to trail
    }
  }, [position]);

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

      {/* Vehicle Marker */}
      {position && (
        <Marker position={position} icon={truckIcon}>
          <Tooltip direction="top" offset={[0, -20]} opacity={1}>
            🚚 Vehicle<br />
            Lat: {position[0].toFixed(4)}, Lon: {position[1].toFixed(4)}
          </Tooltip>
        </Marker>
      )}

      {/* Route Polyline */}
      {route.length > 1 && (
        <Polyline positions={route} color="blue" weight={3} opacity={0.7} />
      )}

      <MapUpdater position={position} />
    </MapContainer>
  );
}

export default Map;
