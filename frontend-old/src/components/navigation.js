import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="navigation">
      <div className="left3">
      <Link to="/"><div className="logo">BloomBuddy</div></Link>
      </div>
      <div className="middle">
        <Link to="/aboutus"><a href="#">About Us</a></Link>
        <Link to="/productpage"><a href="#">Products</a></Link>
        <Link to="/dashboard"><a href="#">Dashboard</a></Link>
        <Link to="/blog"><a href="#">Blogs</a></Link>
      </div>
      <div className="right4">
        <Link to="/Login"><button class="button">Log Out</button></Link>
      </div>
    </div>
  );
}

export default Navigation;
