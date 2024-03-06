import React, { useState } from 'react';
import Navigation from './navigation';
import SoilMoistureChart from './SoilMoistureChart'; // Import the SoilMoistureChart component
import Footer from './footer';

function Dashboard() {
  // State variables for startDate, endDate, and userId
  const [startDate, setStartDate] = useState("2024-02-26");
  const [endDate, setEndDate] = useState("2024-03-06");
  const [userId, setUserId] = useState(1234567891);

  return (
    <div className="dashboard">
      <Navigation />

      {/* Soil Moisture Chart */}
      <div className="chart">
        {/* Pass startDate, endDate, and userId as props to SoilMoistureChart */}
        <SoilMoistureChart deviceId={userId} startDate={startDate} endDate={endDate} />
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;