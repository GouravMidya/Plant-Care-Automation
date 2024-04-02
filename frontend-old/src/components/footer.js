import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer-container">
      <div className="left3">
      <Link to="/"><div className="logo">BloomBuddy</div></Link>
      </div>
      <div className="middle">
        <Link to="/"><a href="#">@2024 BloomBuddy</a></Link>
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
