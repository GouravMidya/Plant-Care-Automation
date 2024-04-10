import React from 'react';
import { Container, Typography, TextField, Box, Button, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

import './App.css';

function Contact() {
  return (
    <Container className="contact-container">
      <br/>
      <Typography textAlign={'left'}><strong>"Let's Grow Together! Reach out to us and let's nurture your plant care journey, one leaf at a time."</strong></Typography>
      <br></br>
      <Grid container spacing={2} className="top-row">
        <Grid item xs={12} md={6} className="left2">
          <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, textAlign: { xs: 'center', md: 'left' } }}><strong>Contact Form</strong></Typography>
          <br></br>
          <TextField id="name" label="Name" fullWidth sx={{ marginBottom: '1rem' }} /><br/>
          <TextField id="email" label="Email" fullWidth sx={{ marginBottom: '1rem' }} /><br/>
          <TextField id="message" label="Message" multiline rows={4} fullWidth sx={{ marginBottom: '1rem' }} /><br/>
          <div className="checkbox-group">
            <input type="checkbox" id="terms" name="terms" />
            <label htmlFor="terms">I accept the terms and conditions</label>
          </div>
          <Button  variant="outlined" className="button">Submit</Button>
        </Grid>
        <Grid item xs={12} md={6} className="right2" sx={{ marginTop:{xs:'-2rem', md:'-8rem'}}}>
        <div className="contact-details">
          <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
            <Box display="flex" alignItems="center" marginBottom={2}>
              <EmailIcon fontSize="large" color="primary"/>
              <Typography variant="body1" marginLeft={2}>
                <strong>Email</strong>
                <br />
                bloombuddy@admin.com
              </Typography>
            </Box>
          </Container>

          <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
            <Box display="flex" alignItems="center" marginBottom={2}>
              <LocationOnIcon fontSize="large" color="primary"/>
              <Typography variant="body1" marginLeft={2}>
                Bloombuddy, Kasarvadavli
                <br />
                Thane, India
              </Typography>
            </Box>
          </Container>

          <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
            <Box display="flex" alignItems="center">
              <PhoneIcon fontSize="large" color="primary"/>
              <Typography variant="body1" marginLeft={2}>
                +1234567890
              </Typography>
            </Box>
          </Container>
      </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;
