import './App.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Layout2() {
  return (
    <div className="layout2">
      <div className="left-column">
        <p className="subheading1">Tagline</p>
        <h1 className="heading">Automated Irrigation Control for Efficient Water Use</h1>
        <p className="paragraph">Our smart plant care monitoring system enables automated irrigation control, ensuring efficient water use for optimal plant growth and yield. By accurately monitoring soil moisture levels and weather conditions, our system intelligently adjusts irrigation schedules, saving water and reducing costs.</p>
        <div className="buttons-container">
        <Link to="/aboutus"><button className="button">Learn More</button></Link>
        <Link to="/signup"><button className="button">Sign Up</button></Link>
        </div>
      </div>
      <div className="right-column">
        <div className="image-container1">
          <img src="1.jpg" alt="Your Image" className="image1" />
        </div>
      </div>
    </div>
  );
}

export default Layout2;
