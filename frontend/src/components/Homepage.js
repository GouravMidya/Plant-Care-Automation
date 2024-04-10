
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

function Homepage({user}) {
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
            <Container align="center">
              <div className="buttons" sx={{ marginTop: '1rem' }}>
                <Link to="/aboutus"><Button  variant="outlined" className="learn-more">Learn More</Button></Link>
                {user ? null : <Link to="/signup"><Button  variant="outlined" className="signup">Sign Up</Button></Link>}
              </div>
            </Container>
          </div>
        
      </Container>
      </div>
  );
}
export default Homepage;
