
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Button } from '@mui/material';
import Container from '@mui/material/Container';
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

function Homepage({user}) {
  return (
    <div className="header" style={{ backgroundImage: 'url(grassbg.png)', backgroundSize: 'cover' }}>
      <Container disableGutters>
        
          <div className="aboutl1">
            <Grid item lg={12}>
              <Typography variant="h2" align="center" sx={{ fontSize: { xs: '2rem', md: '4rem' },margin:{ xs:'1rem'}}}>
                <strong>Revolutionize your plant care with our smart monitoring system</strong>
              </Typography>
              
            </Grid>

            <Typography variant="h5" align="center" sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' },margin:{ xs:'1rem'}}}>
              <strong>
              Experience the future of gardening with real-time insights and automated solutions for healthier, happier plants.
              </strong>
            </Typography>
            <Container align="center">
              <div sx={{ marginTop: '1rem' }}>
                <Link to="/aboutus"><StyledButton variant="outlined"  >Learn More</StyledButton></Link>
                {user ? null : <Link to="/signup"><StyledButton  variant="outlined" className="signup">Sign Up</StyledButton></Link>}
              </div>
            </Container>
          </div>
        
      </Container>
      </div>
  );
}
export default Homepage;
