import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from '../utils/authUtils';
import { API_URL } from '../utils/apiConfig';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';

const AddDevice = () => {
  const navigate = useNavigate();
  const user = isAuthenticated();

  const [formData, setFormData] = useState({
    deviceName: '',
    location: '',
    description: '',
    checkIntervals: 15, // Default to recommended value
    pumpDuration: 8, // Default to recommended value for small pots
    threshold: 70, // Default to recommended value
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newDevice = {
        userId: user.id,
        ...formData,
      };

      await axios.post(`${API_URL}/api/user_devices`, newDevice);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2, marginTop: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Device
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                <AlertTitle>Enter Device ID</AlertTitle>
                Enter the device ID that's written on the back of your product box
                </Alert>
                <TextField
                name="deviceId"
                label="Device ID"
                value={formData.deviceId}
                onChange={handleChange}
                required
                fullWidth
                />
            </Grid>
          <Grid item xs={12}>
            <TextField
              name="deviceName"
              label="Device Name"
              value={formData.deviceName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ marginBottom: 2 }}>
              <AlertTitle>Recommended Check Interval</AlertTitle>
              15 minutes
            </Alert>
            <TextField
              name="checkIntervals"
              label="Check Interval (minutes)"
              value={formData.checkIntervals}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ marginBottom: 2 }}>
              <AlertTitle>Recommended Pump Duration</AlertTitle>
              8 seconds for small pots, 12 seconds for medium-sized pots, and more for larger containers.
            </Alert>
            <TextField
              name="pumpDuration"
              label="Pump Duration (seconds)"
              value={formData.pumpDuration}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ marginBottom: 2 }}>
              <AlertTitle>Threshold</AlertTitle>
              Monitor moisture levels: 0% is too dry, 100% is too wet for plants. Adjust accordingly for optimal growth ( Mostly kept at 70% ). 🌱 
            </Alert>
            <TextField
              name="threshold"
              label="Watering Threshold (%)"
              value={formData.threshold}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Device
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddDevice;