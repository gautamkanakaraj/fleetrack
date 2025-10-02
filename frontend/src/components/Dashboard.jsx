import React from "react";
import Map from "./Map.jsx";
import SpeedChart from "./Chart.jsx";
import useSocket from "./useSocket.jsx";

function Dashboard() {
  const { data, cOutput } = useSocket();
  const position = data ? [data.lat, data.lon] : null;

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <div className="map-panel">
          <h2>🚚 Vehicle Location</h2>
          <Map position={position} />
        </div>

        <div className="stats-panel">
          <h2>📊 Vehicle Stats</h2>
          <p>📍 Lat: {data?.lat ?? "N/A"}</p>
          <p>📍 Lon: {data?.lon ?? "N/A"}</p>
          <p>⛰ Altitude: {data?.alt ?? "N/A"} m</p>
          <p>🚀 Speed: {data?.speed ? `${data.speed} km/h` : "N/A"}</p>
          <p>📏 Distance: {data?.distance ?? "N/A"}</p>
          <p>⏱ ETA: {data?.eta ?? "N/A"}</p>
          <p>🕒 Last Updated: {data ? new Date(data.timestamp).toLocaleString() : "N/A"}</p>
        </div>
      </div>

      <div className="chart-panel">
        <SpeedChart speedData={data?.speed} />
      </div>

      {cOutput && (
        <div className="c-output">
          <h3>⚙️ C Program Output</h3>
          <pre>{JSON.stringify(cOutput, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
