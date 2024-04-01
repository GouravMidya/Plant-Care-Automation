import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Button } from '@mui/material';

function Layout2() {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Grid container spacing={2} className="layout2">
        <Grid item xs={12} md={6} className="left-column" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h2" className="heading" sx={{ fontSize: { xs: '1.3rem', md: '2.4rem' }, textAlign: { xs: 'center', md: 'left' } }}>
            <strong>Automated Irrigation Control for Efficient Water Use</strong>
          </Typography>
          <br></br>
          <Typography variant="body1" className="paragraph" sx={{ textAlign: 'center' }}>
            Our smart plant care monitoring system enables automated irrigation control, ensuring efficient water use for optimal plant growth and yield. By accurately monitoring soil moisture levels and weather conditions, our system intelligently adjusts irrigation schedules, saving water and reducing costs.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} className='right-column' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="image-container1">
            <img src="1.jpg" alt="Your Image" className="image1" style={{ width: '105%' }}/>
          </div>
        </Grid>
      </Grid>
      
    </Container>
    
  );
}

export default Layout2;
