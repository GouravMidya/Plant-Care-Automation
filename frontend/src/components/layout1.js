import './App.css'
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Typography, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: 'white',
  backgroundColor: '#2e7d32',
  fontSize: '1.1rem',
  marginTop: '1.5rem',
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#f7faf6', // Change background color on hover
    color: '#2e7d32', // Change text color on hover
  },
}));
function Layout1({ headerHeight,user }) {
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
        <Typography variant="h1" gutterBottom  align="center" sx={{ fontSize: { xs: '0.7rem', md: '1.5rem' }, textAlign: 'justify'}}>Transform your plant care routine with our cutting-edge monitoring system. Achieve precision with real-time insights, automated watering, and personalized alerts. Embrace a seamless blend of technology and nature for healthier, thriving plants. Elevate your gardening experience today and witness the future of smart, effortless plant care.</Typography>
        </Grid>
    </Grid>
    <Container align="center">
              <div sx={{ marginTop: '1rem' }}>
                <Link to="/aboutus"><StyledButton variant="outlined"  >Learn More</StyledButton></Link>
                {user ? null : <Link to="/signup"><StyledButton  variant="outlined" className="signup">Sign Up</StyledButton></Link>}
              </div>
            </Container>
        </div>
        <div className="row">
          <div className="image-container">
            <img src="1.jpg" alt="Your " className="image" style={{ borderRadius: "23px"}}/>
          </div>
        </div>
    </Container>
  );
}

export default Layout1;
