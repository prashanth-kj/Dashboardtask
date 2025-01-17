import React from 'react';
import { useContext } from 'react';
import { DashboardDataContext } from './context/DashboardContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DistanceTile({ startdate, enddate }) {
  const { dashboardData } = useContext(DashboardDataContext);

  const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  // Filter data by date
  const filteredData = dashboardData.filter((trip) => {
    const tripDate = new Date(trip['Schedule Trip Start Time']);
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Group distances by TT number
  const distancesByTT = {};
  filteredData.forEach((trip) => {
    const ttNumber = trip['TT Number'];
    const scheduledDistance = parseFloat(trip['Scheduled Distance']) || 0;
    const actualDistance = parseFloat(trip['Actual Distance']) || 0;

    if (!distancesByTT[ttNumber]) {
      distancesByTT[ttNumber] = { scheduled: 0, actual: 0 };
    }

    distancesByTT[ttNumber].scheduled += scheduledDistance;
    distancesByTT[ttNumber].actual += actualDistance;
  });

  // Prepare data for the chart
  const labels = Object.keys(distancesByTT);
  const scheduledDistances = labels.map((tt) => distancesByTT[tt].scheduled);
  const actualDistances = labels.map((tt) => distancesByTT[tt].actual);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Scheduled Distance (km)',
        data: scheduledDistances,
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Light teal
        borderColor: 'rgba(75, 192, 192, 1)',       // Dark teal
        borderWidth: 1,
      },
      {
        label: 'Actual Distance (km)',
        data: actualDistances,
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Light red
        borderColor: 'rgba(255, 99, 132, 1)',       // Dark red
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Legend on top
      },
      tooltip: {
        enabled: true, // Show tooltips on hover
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Distance (km)',
        },
        ticks: {
          beginAtZero: true, // Ensure scale starts at zero
        },
      },
      y: {
        title: {
          display: true,
          text: 'TT Numbers',
        },
      },
    },
  };

  return (
    <div className="container">
      <h5>Scheduled vs Actual Distance by TT Number</h5>
      {labels.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default DistanceTile;

