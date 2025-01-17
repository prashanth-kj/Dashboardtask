import React, { useContext } from 'react';
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

  // Parsing start and end date to Date objects
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  // Filter data by date
  const filteredData = dashboardData.filter((trip) => {
    const tripDate = new Date(trip['Schedule Trip Start Time']);
    console.log('Trip Date:', tripDate);
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Log filtered data
  console.log('Filtered Data:', filteredData);

  // Group distances by TT number
  const distancesByTT = {};

  filteredData.forEach((trip) => {
    const ttNumber = trip['TT Number'];
    const scheduledDistance = parseFloat(trip['Schedule Trip Distance (KM)']);
    const actualDistance = parseFloat(trip['Actual Trip Distance (KM)']) ;

    if (!distancesByTT[ttNumber]) {
      distancesByTT[ttNumber] = { scheduled: 0, actual: 0 };
    }

    distancesByTT[ttNumber].scheduled += scheduledDistance;
    distancesByTT[ttNumber].actual += actualDistance;
  });

  // Log grouped distances by TT
  console.log('Distances by TT:', distancesByTT);

  // Prepare data for the chart
  const labels = Object.keys(distancesByTT);
  const scheduledDistances = labels.map((tt) => distancesByTT[tt].scheduled);
  const actualDistances = labels.map((tt) => distancesByTT[tt].actual);

  // Log chart data
  console.log('Chart Data:', {
    labels,
    datasets: [
      {
        label: 'Scheduled Distance (km)',
        data: scheduledDistances,
      },
      {
        label: 'Actual Distance (km)',
        data: actualDistances,
      },
    ],
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Scheduled Distance (km)',
        data: scheduledDistances,
        backgroundColor: '#158CFC', // Light blue
        borderColor: 'rgba(54, 162, 235, 1)', // Dark blue
        borderWidth: 1,
      },
      {
        label: 'Actual Distance (km)',
        data: actualDistances,
        backgroundColor: '#FFDA13', // Light red
        borderColor: 'rgba(255, 99, 132, 1)', // Dark red
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false, // Allow chart resizing
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Distance (km)',
        },
        ticks: {
          beginAtZero: true,
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
    <div className="container shadow p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <h5>Scheduled vs Actual Distance by TT Number</h5>
      {labels.length > 0 ? (
        <div style={{ height: `${labels.length * 50}px` }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default DistanceTile;
