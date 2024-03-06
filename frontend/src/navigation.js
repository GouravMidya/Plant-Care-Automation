import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="navigation">
      <div className="left3">
      <Link to="/"><div className="logo">LOGO</div></Link>
      </div>
      <div className="middle">
        <a href="#">About Us</a>
        <a href="#">Products</a>
        <a href="#">Dashboard</a>
      </div>
      <div className="right4">
        <Link to="/Login"><button class="button">Login</button></Link>
        <button class="button">Sign Up</button>
      </div>
    </div>
  );
}

export default Navigation;
