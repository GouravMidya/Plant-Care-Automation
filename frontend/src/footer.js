import React from 'react';
import './App.css';

function Footer() {
  return (
    <div className="footer-container">
      <div className="left3">
      <div className="logo">LOGO</div>
      </div>
      <div className="middle">
        <a href="#">About Us</a>
        <a href="#">Products</a>
        <a href="#">Dashboard</a>
      </div>
      <div className="right3">
        <a href="#"><img src="facebook.png" alt="Facebook" className="social-logo" /></a>
        <a href="#"><img src="twitterx.png" alt="Twitter" className="social-logo" /></a>
        <a href="#"><img src="instagram.png" alt="Instagram" className="social-logo" /></a>
      </div>
    </div>
  );
}

export default Footer;
