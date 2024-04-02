
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import Container from '@mui/material/Container';


function Homepage() {
  return (
    <div className="header" >
      <Container disableGutters>
        
          <div className="aboutl1">
            <Grid item lg={12}>
              <Typography variant="h2" align="center" sx={{ fontSize: { xs: '2rem', md: '4rem' },margin:{ xs:'1rem'}}}>
                <strong>Revolutionize your plant care
                <br />
                with our smart monitoring system</strong>
              </Typography>
              
            </Grid>

            <Typography variant="h5" align="center" sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' },margin:{ xs:'1rem'}}}>
              <strong>
              Experience the future of gardening with real-time insights and automated solutions for healthier, happier plants.
              </strong>
            </Typography>
            <div className="buttons" sx={{ marginTop: '1rem' }}>
              <Link to="/aboutus"><Button variant="contained" className="learn-more">Learn More</Button></Link>
              <Link to="/signup"><Button variant="contained" className="signup">Sign Up</Button></Link>
            </div>
          </div>
        
      </Container>
      </div>
  );
}
export default Homepage;
