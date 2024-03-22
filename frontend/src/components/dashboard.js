import React, { useState, useEffect } from 'react';
import Navigation from './navigation';
import SoilMoistureChart from './SoilMoistureChart';
import TemperatureChart from './TemperatureChart';
import Footer from './footer';
import Card from './card'; 

function Dashboard() {
  // State variables
  const [deviceId, setDeviceId] = useState(null); // Change state variable name to deviceId
  const [graphTitle, setGraphTitle] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [animationRunning, setAnimationRunning] = useState(true);

  useEffect(() => {
    // Increment animationKey to reset animation when deviceId changes
    setAnimationKey(key => key + 1);
  }, [deviceId]);

  const handleGraphButtonClick = (deviceId, deviceName) => {
    setDeviceId(deviceId);
    setGraphTitle(`Graph for Device ${deviceId} - ${deviceName}`);
  };

  const handleChangeValues = () => {
    // Implement logic to change device values here
    setAnimationRunning(false); // Stop animation
  };

  // Sample data for devices
  const devices = [
    { id: 1000000001, name: 'Device 1', status: 'online' },
    { id: 1000000000, name: 'Device 2', status: 'offline' },
    { id: 3, name: 'Device 3', status: 'online' },
    { id: 4, name: 'Device 4', status: 'online' },
    // Add more devices here...
  ];

  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='card-container' style={{ display: 'flex', justifyContent: 'center' }}>
          {devices.map(device => (
            <Card key={device.id} device={device} handleGraphButtonClick={handleGraphButtonClick} />
          ))}
        </div>  

        {deviceId && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h2 style={{ textAlign: 'center' }}>{graphTitle}</h2>
          </div>
        )}

        {deviceId && (
          <div className="chart-container" key={animationKey} style={{ animation: animationRunning ? 'slideIn 1s forwards' : 'none' }}>
            <div className="SoilMoistureChart" style={{ width:'75%', marginRight:'5%', marginLeft:'-5%'}}>
              <SoilMoistureChart deviceId={deviceId} /> {/* Pass deviceId as a prop to SoilMoistureChart */}
            </div>
            <div className="TemperatureChart" style={{ width:'75%',marginLeft:'5%', marginRight:'0%'}}>
              <TemperatureChart deviceId={deviceId} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
