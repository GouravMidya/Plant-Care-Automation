import React, { useState } from 'react';

const Card = ({ device }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeValues = () => {
    // Implement logic to change device values here
    handleClose(); // Close popup after changing values
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', maxWidth: '300px' }}>
      <h3>Device ID: {device.id}</h3>
      <p>Device Name: {device.name}</p>
      <p>Device Status: {device.status}</p>
      <button onClick={handleOpen}>Change Values</button>
      <button >Graph</button>
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', maxWidth: '300px' }}>
            <h3>Update values</h3>
            <button onClick={handleChangeValues}>Save Changes</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const dashcard = () => {
  // Sample data for devices
  const devices = [
    { id: 1, name: 'Device 1', status: 'online' },
    { id: 2, name: 'Device 2', status: 'offline' },
    { id: 3, name: 'Device 3', status: 'online' },
    // Add more devices here...
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {devices.map(device => (
          <Card key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
};

export default dashcard;
