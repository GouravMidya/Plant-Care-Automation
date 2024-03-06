import './App.css'
import React from 'react';

const Header = React.forwardRef((props, ref) => {
  return (
    <div className="header" ref={ref}>
      <div className="card">
        <h1 className="title">Revolutionize your plant care with our smart monitoring system</h1>
        <h2 className="subtitle">Experience the future of gardening with real-time insights and automated solutions for healthier, happier plants.</h2>
        <div className="buttons">
          <button className="learn-more">Learn More</button>
          <button className="signup">Sign Up</button>
        </div>
      </div>
    </div>
  );
});

export default Header;
