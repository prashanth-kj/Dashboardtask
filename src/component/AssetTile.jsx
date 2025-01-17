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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function AssetUtilizationChart({ startdate, enddate }) {
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
  const utilizationByDate = {};

  filteredData.forEach((trip) => {
    const tripDate = new Date(trip["Schedule Trip Start Time"]).toLocaleDateString();
    let assetUtilization = parseFloat(trip["AssetUtilizationPerRow"]) || 0;
       
    if (!utilizationByDate[tripDate]) {
      utilizationByDate[tripDate] = 0;
    }

    utilizationByDate[tripDate] += assetUtilization;
  });

  // Prepare data for the chart
  const labels = Object.keys(utilizationByDate);

  // Sort dates in ascending order
  labels.sort((a, b) => new Date(a) - new Date(b));

  const assetUtilizationValues = labels.map((date) => utilizationByDate[date]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Asset Utilization Per Row (%)",
        data: assetUtilizationValues,
        borderColor: "#FFDA13", // Teal line
        backgroundColor: "#FFDA13", // Light teal fill
        fill: true,
        tension: 0.4, // Smooth curve
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
          text: "Asset Utilization (%)",
          color: "#000",
        },
        beginAtZero: true,
        max:10
      },
    },
  };

  return (
    <div className="container">
      <h5>Asset Utilization Per Row (%) by Date</h5>
      {labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default AssetUtilizationChart;
