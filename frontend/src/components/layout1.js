import './App.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Layout1({ headerHeight }) {
    const layoutStyle = {
        marginTop: `${headerHeight-headerHeight}px`, // Set top margin dynamically based on the header height
        minHeight: `calc(100vh - ${headerHeight}px)` // Use camelCase for minHeight
    };
    
  return (
    <div className="layout1" style={layoutStyle}>
      <div className="column">
        <div className="row">
          <div className="left">
            <p className="subheading">Empowering Plant Enthusiasts</p>
            <h1 className="heading">Real-Time Data Monitoring for Smart Plant Care</h1>
          </div>
          <div className="right">
            <p>Transform your plant care routine with our cutting-edge monitoring system. Achieve precision with real-time insights, automated watering, and personalized alerts. Embrace a seamless blend of technology and nature for healthier, thriving plants. Elevate your gardening experience today and witness the future of smart, effortless plant care.</p>
            <div className="buttons">
              <Link to="/aboutus"><button className="learn-more">Learn More</button></Link>
              <Link to="/signup"><button className="signup">Sign Up</button></Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="image-container">
            <img src="1.jpg" alt="Your Image" className="image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout1;
