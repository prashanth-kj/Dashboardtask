import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { DashboardDataContext } from "./context/DashboardContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TripDistance({ startdate, enddate }) {
  const { dashboardData } = useContext(DashboardDataContext);

  // Convert the start and end dates to Date objects
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  // Filter data based on the date range
  const filteredData = dashboardData.filter((trip) => {
    const tripDate = new Date(trip["Schedule Trip Start Time"]);
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Process data for the line chart
  const distancesByDate = {};

  filteredData.forEach((trip) => {
    const tripDate = new Date(trip["Schedule Trip Start Time"]).toLocaleDateString();
    const scheduledDistance = parseFloat(trip["Schedule Trip Distance (KM)"]) || 0;
    const actualDistance = parseFloat(trip["Actual Trip Distance (KM)"]) || 0;

    if (!distancesByDate[tripDate]) {
      distancesByDate[tripDate] = { scheduled: 0, actual: 0 };
    }

    distancesByDate[tripDate].scheduled += scheduledDistance;
    distancesByDate[tripDate].actual += actualDistance;
  });

  const sortedDates = Object.keys(distancesByDate).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });


  const scheduledDistances = sortedDates.map((date) => distancesByDate[date].scheduled);
  const actualDistances = sortedDates.map((date) => distancesByDate[date].actual);

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Scheduled Trip Distance (KM)",
        data: scheduledDistances,
        borderColor: "#428ED5",
        backgroundColor: "#FFDA13",
        fill: true,
        tension: 0.4, 
      },
      {
        label: "Actual Trip Distance (KM)",
        data: actualDistances,
        borderColor: "#158CFC", 
        backgroundColor: "#158CFC", 
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#000",
        },
      },
      y: {
        title: {
          display: true,
          text: "Distance (KM)",
          color: "#000",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container">
      <h5>Actual vs Scheduled Trip Distance Per Date</h5>
      {sortedDates.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default TripDistance;
