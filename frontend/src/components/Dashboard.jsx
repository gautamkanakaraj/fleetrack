import React from 'react';
import Map from './map.jsx';
import SpeedChart from './Chart.jsx';
import useSocket from './useSocket.jsx';

function Dashboard() {
  const data = useSocket('http://localhost:5000'); // Replace with your server URL
  const position = data ? [data.lat, data.lon] : null;

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <div className="map-panel">
          <h2>
            <i className="fas fa-map-marked-alt"></i> Vehicle Location
          </h2>
          <Map position={position} />
        </div>
        <div className="stats-panel">
          <h2>
            <i className="fas fa-tachometer-alt"></i> Vehicle Stats
          </h2>
          <div className="stats-grid">
            <div className="stat-item">
              <i className="fas fa-tachometer-alt"></i>
              <span>Speed:</span> {data ? `${data.speed} km/h` : 'N/A'}
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <span>ETA:</span> {data ? data.eta : 'N/A'}
            </div>
            <div className="stat-item">
              <i className="fas fa-road"></i>
              <span>Distance:</span> {data ? `${data.distance} km` : 'N/A'}
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <span>Last Updated:</span>{' '}
              {data ? new Date(data.timestamp).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      <div className="chart-panel">
        <SpeedChart speedData={data?.speed} />
      </div>
    </div>
  );
}

export default Dashboard;