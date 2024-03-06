import React, { useState } from 'react';
import Navigation from './navigation';
import SoilMoistureChart from './SoilMoistureChart';
import Footer from './footer';

function Dashboard() {
  // State variable for userId
  const [userId, setUserId] = useState(1000000000);

  return (
    <div className="dashboard">
      <Navigation />

      <div className="SoilMoistureChart">
        <SoilMoistureChart deviceId={userId} />
      </div>
      

      <Footer />
    </div>
  );
}

export default Dashboard;
