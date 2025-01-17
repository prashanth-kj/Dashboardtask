import React, { useContext } from "react";
import { DashboardDataContext } from "./context/DashboardContext";

function FleetTile({ startdate, enddate }) {
  const { dashboardData } = useContext(DashboardDataContext);

  // Convert the start and end dates to Date objects
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  // Filter data based on the date range
  const filteredData = dashboardData.filter((trip) => {
    const tripDate = new Date(trip["Schedule Trip Start Time"]);
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Calculate total scheduled and actual distances
  let totalScheduledDistance = 0;
  let totalActualDistance = 0;

  filteredData.forEach((trip) => {
    const scheduledDistance = parseFloat(trip["Schedule Trip Distance (KM)"]) || 0;
    const actualDistance = parseFloat(trip["Actual Trip Distance (KM)"]) || 0;

    totalScheduledDistance += scheduledDistance;
    totalActualDistance += actualDistance;
  });

  // Calculate scaled fleet efficiency
  const totalFleetEfficiency =
    totalActualDistance + totalScheduledDistance > 0
      ? (totalActualDistance /
          (totalActualDistance + totalScheduledDistance)) *
        100
      : 0;

  return (
    <div className="container shadow p-3">
      <h5>Total Fleet Efficiency</h5>
      {filteredData.length > 0 ? (
        <div>
          <p>
             Fleet Efficiency: {totalFleetEfficiency.toFixed(2)}%
          </p>
        </div>
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
}

export default FleetTile;
