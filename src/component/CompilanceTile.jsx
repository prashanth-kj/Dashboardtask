
import React from 'react';
import { useContext } from 'react';
import { DashboardDataContext } from './context/DashboardContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function CompilanceTile({ startdate, enddate }) {
  let { dashboardData } = useContext(DashboardDataContext);
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  // Filter the dashboard data based on the selected date range
  let filteredData = dashboardData.filter((trip) => {
    let tripDate = new Date(trip['Schedule Trip Start Time']);
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Calculate the number of violations
  let totalTrips = filteredData.length;

  // Initialize counters for the different violations
  let routeDeviationCount = 0;
  let stoppageViolationCount = 0;
  let speedViolationCount = 0;

  // Iterate over the filtered trips and count the violations
  filteredData.forEach((trip) => {
    if (trip['Route Deviation'] === '1' || trip['Route Deviation'] === '2') {
        routeDeviationCount++;
      }
      if (trip['Stoppage Violation'] === '1') {
        stoppageViolationCount++;
      }
      if (trip['Speed Violation'] === '1') {
        speedViolationCount++;
      }
      
  });

  // Calculate the violation percentages
  const routeDeviationPercentage = totalTrips ? (routeDeviationCount / totalTrips) * 100 : 0;
  const stoppageViolationPercentage = totalTrips ? (stoppageViolationCount / totalTrips) * 100 : 0;
  const speedViolationPercentage = totalTrips ? (speedViolationCount / totalTrips) * 100 : 0;

  // Prepare the data for the Doughnut chart
  const chartData = {
    labels: ['Route Deviation', 'Stoppage Violation', 'Speed Violation'],
    datasets: [
      {
        data: [
          routeDeviationPercentage,
          stoppageViolationPercentage,
          speedViolationPercentage,
        ],
        backgroundColor: [ '#158CFC' ,'#FFDA13','#ff4d4d'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="container shadow p-2">
      <h5>Compliance Violations Percentage</h5>
      {totalTrips > 0 ? (
        <Doughnut data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default CompilanceTile;
