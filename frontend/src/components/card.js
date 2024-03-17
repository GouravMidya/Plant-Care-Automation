import React, { useState } from 'react';

const Card = ({ device, handleGraphButtonClick }) => {
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

  const handleGraphClick = () => {
    handleGraphButtonClick(device.id);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', maxWidth: '300px' }}>
      <h3>Device ID: {device.id}</h3>
      <p>Device Name: {device.name}</p>
      <p>Device Status: {device.status}</p>
      <button onClick={handleOpen}>Change Values</button>
      <button onClick={handleGraphClick}>Graph</button>
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2}}>
          <div style={{ background: '#fff', padding: '20px', maxWidth: '300px' }}>
            <h3>Update values of {device.id}</h3>
            <h4>Pump duration</h4>
            <h4>temperature</h4>
            <button onClick={handleChangeValues}>Save Changes</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
