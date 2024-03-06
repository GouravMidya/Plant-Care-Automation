import './App.css';
import React from 'react';

function Navigation() {
  return (
    <div className="navigation">
      <div className="left3">
      <div className="logo">LOGO</div>
      </div>
      <div className="middle">
        <a href="#">About Us</a>
        <a href="#">Products</a>
        <a href="#">Dashboard</a>
      </div>
      <div className="right4">
        <button class="button">Login</button>
        <button class="button">Sign Up</button>
      </div>
    </div>
  );
}

export default Navigation;
