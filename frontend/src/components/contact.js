import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Button, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import './App.css';

function Contact() {
  const [submitted, setSubmitted] = useState(false); // State to track form submission
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const formData = new FormData(event.target); // Get form data
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
  
    try {
      // Send POST request to the server

      handleReset();
      await axios.post(`${API_URL}/contact`, data);
      // Optionally, you can handle success, show a success message, or redirect the user
      console.log('Contact form submitted successfully');
      setSubmitted(true); // Set submitted state to true
      event.target.reset(); // Reset form fields
    } catch (error) {
      // Handle error
      console.error('Error submitting contact form:', error.message);
      setErrorMessage('Error submitting form. Please try again.'); // Set error message

    }
  };

  const handleReset = () => {
    setSubmitted(false); // Reset submitted state
    setErrorMessage(''); // Clear error message
  };

  return (
    <Container className="contact-container">
      <br />
      <Typography textAlign={'center'}>
        <strong>"Let's Grow Together! Reach out to us and let's nurture your plant care journey, one leaf at a time."</strong>
      </Typography>
      <br />
      <form onSubmit={handleSubmit}>
  <Grid container spacing={2} className="top-row">
    <Grid item xs={12} md={6} className="left2">
      <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, textAlign: { xs: 'center', md: 'left' } }}>
        <strong>Contact Form</strong>
      </Typography>
      <br />
      <TextField id="name" name="name" label="Name" fullWidth sx={{ marginBottom: '1rem' }} />
      <TextField id="email" name="email" label="Email" fullWidth sx={{ marginBottom: '1rem' }} />
      <TextField id="message" name="message" label="Message" multiline rows={4} fullWidth sx={{ marginBottom: '1rem' }} />
      <Grid container alignItems="center">
        <Grid item xs={4} md={3}>
          <Button type="submit" variant="outlined" className="button">Submit</Button>
        </Grid>
        <Grid item xs={8} md={9}>
          {submitted && (
            <Typography variant="body1" sx={{ color: 'green',textAlign:'left' }}>Form has been submitted</Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" sx={{ color: 'red',textAlign:'left' }}>{errorMessage}</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} md={6} className="right2" sx={{ marginTop: { xs: '-2rem', md: '-8rem' } }}>
      <div className="contact-details">
        <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <EmailIcon fontSize="large" color="primary" />
            <Typography variant="body1" marginLeft={2}>
              <strong>Email</strong>
              <br />
              bloombuddy@admin.com
            </Typography>
          </Box>
        </Container>

        <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <LocationOnIcon fontSize="large" color="primary" />
            <Typography variant="body1" marginLeft={2}>
              Bloombuddy, Kasarvadavli
              <br />
              Thane, India
            </Typography>
          </Box>
        </Container>

        <Container sx={{ marginLeft: { xs: '-4rem', md: '0rem' } }}>
          <Box display="flex" alignItems="center">
            <PhoneIcon fontSize="large" color="primary" />
            <Typography variant="body1" marginLeft={2}>
              +1234567890
            </Typography>
          </Box>
        </Container>
      </div>
    </Grid>
  </Grid>
</form>

    </Container>
  );
}

export default Contact;
