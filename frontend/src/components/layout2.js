import React from 'react';
import { Container, Grid, Typography } from '@mui/material';

function Layout2() {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Grid container spacing={5} className="layout2">
        <Grid item xs={12} md={6} className="left-column" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
          <Typography variant="h2" className="heading" sx={{ fontSize: { xs: '1.3rem', md: '2.4rem' }, textAlign: { xs: 'center', md: 'left' } }}>
            <strong>Automated Irrigation Control for Efficient Water Use</strong>
          </Typography>
          <br></br>
          <Typography variant="body1" className="paragraph" sx={{ textAlign: 'justify' } }>
            Our smart plant care monitoring system enables automated irrigation control, ensuring efficient water use for optimal plant growth and yield. By accurately monitoring soil moisture levels and weather conditions, our system intelligently adjusts irrigation schedules, saving water and reducing costs.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} className='right-column' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
            <img src="PlantHome2.png" alt="Yourfile" className="image1" style={{ width: '100%', height:'80%',  borderRadius: "9px"}}/>
          
        </Grid>
      </Grid>
      
    </Container>
    
  );
}

export default Layout2;
