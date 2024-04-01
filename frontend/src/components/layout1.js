import './App.css'
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Box, Typography, Grid, Button } from '@mui/material';

function Layout1({ headerHeight }) {
    const layoutStyle = {
        marginTop: `${headerHeight-headerHeight}px`, // Set top margin dynamically based on the header height
        minHeight: `calc(100vh - ${headerHeight}px)` // Use camelCase for minHeight
    };
    
  return (
    <Container disableGutters>
      <br></br>
    <div className="layout1" style={layoutStyle}>
    <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '0.7rem', md: '1.2rem' }, textAlign: { xs: 'center', md: 'left' } }}><strong>Empowering Plant Enthusiasts</strong></Typography>
          <Typography variant="h2" className="heading" sx={{ fontSize: { xs: '1.3rem', md: '2.4rem' }, textAlign: { xs: 'center', md: 'left' } }}>
          <strong>Real-Time Data Monitoring for <br />Smart Plant Care</strong></Typography>
        </Grid>


        <Grid item xs={12} md={6}>
        <Typography variant="h1" gutterBottom  align="center" sx={{ fontSize: { xs: '0.7rem', md: '1.5rem' }}}>Transform your plant care routine with our cutting-edge monitoring system. Achieve precision with real-time insights, automated watering, and personalized alerts. Embrace a seamless blend of technology and nature for healthier, thriving plants. Elevate your gardening experience today and witness the future of smart, effortless plant care.</Typography>
        </Grid>
    </Grid>
    <div className="buttons" style={{ textAlign: 'center' }}>
              <Link to="/aboutus"><button className="learn-more">Learn More</button></Link>
              <Link to="/signup"><button className="signup">Sign Up</button></Link>
            </div>
        </div>
        <div className="row">
          <div className="image-container">
            <img src="1.jpg" alt="Your Image" className="image" />
          </div>
        </div>
    </Container>
  );
}

export default Layout1;
