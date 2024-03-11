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
      <div class="card">
        <div class="card-header">
          <h2>Title</h2>
          <button>Button</button>
        </div>
        <div class="card-footer">
          <div class="subtitle">
            <h3>Subtitle 1</h3>
            <button>Button 1</button>
          </div>
          <div class="subtitle">
            <h3>Subtitle 2</h3>
            <button>Button 2</button>
          </div>
        </div>
      </div>

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
