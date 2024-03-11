import './App.css'
import React from 'react';

const Header = React.forwardRef((props, ref) => {
  return (
    <div className="header" ref={ref}>
      <div className="aboutl1">
        <h1>Revolutionize your plant care<br></br> with our smart monitoring system</h1>
        <p>Experience the future of gardening with real-time insights and automated solutions for healthier, happier plants.</p>
        <div className="buttons">
          <button className="learn-more">Learn More</button>
          <button className="signup">Sign Up</button>
        </div>
      </div>
    </div>
  );
});

export default Header;
