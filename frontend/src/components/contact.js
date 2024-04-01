import React from 'react';
import { Container, Typography, TextField, Checkbox, Button, Grid } from '@mui/material';
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
          <TextField id="name" label="Name" fullWidth />
          <TextField id="email" label="Email" fullWidth />
          <TextField id="message" label="Message" multiline rows={4} fullWidth />
          <div className="checkbox-group">
            <input type="checkbox" id="terms" name="terms" />
            <label htmlFor="terms">I accept the terms and conditions</label>
          </div>
          <button className="button">Submit</button>
        </Grid>
        <Grid item xs={12} md={6} className="right2" sx={{ marginTop:{xs:'0rem', md:'-8rem'}}}>
          <div className="contact-details">
            <div style={{marginLeft:'-2rem'}}>
            <div><img src='email.png' alt="Email" className='cont-img' /></div>
            <div><Typography variant="body1" marginLeft={'5rem'} marginTop={'-3.5rem'}><strong>Email</strong><br/>bloombuddy@admin.com</Typography></div>
            </div>
            <br/>
            <div style={{marginLeft:'-2rem'}}>
              <img src='location.png' alt="Location" className='cont-img' />
              <Typography variant="body1" marginLeft={'5rem'} marginTop={'-3.5rem'}>Bloombuddy, Kasarvadavli<br/> Thane, India</Typography>
            </div>
            <br/>
            <div style={{marginLeft:'-2rem'}}>
              <img src='phone.png' alt="Phone" className='cont-img' />
              <Typography variant="body1" marginLeft={'5rem'} marginTop={'-3.3rem'}>+1234567890</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;
