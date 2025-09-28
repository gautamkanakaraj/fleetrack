import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SpeedChart({ speedData }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Speed (km/h)',
        data: [],
        borderColor: '#1e90ff',
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (speedData) {
      setChartData((prev) => {
        const newLabels = [...prev.labels, new Date().toLocaleTimeString()].slice(-20);
        const newData = [...prev.datasets[0].data, speedData].slice(-20);
        return {
          labels: newLabels,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }
  }, [speedData]);

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Vehicle Speed (Last 20 Updates)' },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Speed (km/h)' } },
            x: { title: { display: true, text: 'Time' } },
          },
        }}
      />
    </div>
  );
}

export default SpeedChart;