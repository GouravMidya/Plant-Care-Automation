import React, { useState } from 'react';
import Navigation from './navigation';
import SoilMoistureChart from './SoilMoistureChart';
import TemperatureChart from './TemperatureChart';
import Footer from './footer';

function Dashboard() {
  // State variable for userId
  const [userId, setUserId] = useState(1000000000);

  return (
    <div className="dashboard">
      <Navigation />

    <div className="chart-container">
      <div className="SoilMoistureChart">
        <SoilMoistureChart deviceId={userId} />
      </div>
      <div className="TemperatureChart">
        <TemperatureChart deviceId={userId} />
      </div>
    </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
