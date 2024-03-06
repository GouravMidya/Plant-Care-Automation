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
        <Link to="/aboutus"><a href="#">About Us</a></Link>
        <Link to="/productpage"><a href="#">Products</a></Link>
        <Link to="/dashboard"><a href="#">Dashboard</a></Link>
      </div>
      <div className="right4">
        <Link to="/Login"><button class="button">Login</button></Link>
        <button class="button">Sign Up</button>
      </div>
    </div>
  );
}

export default Navigation;
