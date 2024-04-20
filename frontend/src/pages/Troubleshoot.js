import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig'

const Troubleshoot = () => {
  // const { deviceId } = useParams();
  // const [device, setDevice] = useState(null);
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  // useEffect(() => {
  //   const fetchDevice = async () => {
  //     try {
  //       const payload = {
  //         deviceId,
  //       };
  //       const response = await axios.post(`${API_URL}/api/user_devices/settings`, payload);
  //       setDevice(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching device:', error);
  //     }
  //   };
  //   fetchDevice();
  // }, [deviceId]);


  const troubleshootingGuides = [
    {
      id: 1,
      title: 'Sensor readings inconsistent',
      steps: [
        'Check sensor connections to ensure they are securely attached to the central control unit.',
        'Verify that sensors are properly calibrated according to manufacturer instructions.',
        'Clean sensors regularly to remove any dirt or debris that may interfere with readings.',
        'Replace sensors if they are damaged or faulty.'
      ],
    },
    {
      id: 2,
      title: 'Network Issues (Red light on device is on)',
      steps: [
        'Ensure that the central control unit is powered on and connected to the internet.',
        'Check network connectivity and Wi-Fi signal strength.',
        'Restart the central control unit and/or router to refresh connections.',
      ],
    },
    {
      id: 3,
      title: 'Incorrect Watering Patterns',
      steps: [
        'Review and adjust watering parameters in the system settings to better match plant requirements.',
        'Verify that sensors are accurately measuring soil moisture levels and other environmental factors.',
        'Inspect the irrigation system for any leaks or blockages that may be affecting water distribution.'],
    },
    {
      id: 4,
      title: 'Power Interruptions',
      steps: [
        'Check power connections to ensure they are secure and free from damage.',
        'Install a backup power source (e.g., battery backup) to prevent interruptions during power outages.',
      ],
    },
  ];

  const handleExpandClick = (guideId) => {
    setExpandedGuideId(guideId === expandedGuideId ? null : guideId);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      <Grid container spacing={4}>
        {troubleshootingGuides.map((guide) => (
          <Grid item xs={12} md={6} key={guide.id}>
            <Card>
              <CardHeader
                title={guide.title}
                action={
                  <Button size="small" onClick={() => handleExpandClick(guide.id)}>
                    {expandedGuideId === guide.id ? 'Collapse' : 'Expand'}
                  </Button>
                }
              />
              <Collapse in={expandedGuideId === guide.id}>
                <CardContent>
                  <Typography variant="body1">Steps:</Typography>
                  <Box sx={{ ml: 2 }}>
                    {guide.steps.map((step, index) => (
                      <Typography key={index} variant="body2">
                        {index + 1}. {step}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}

         {/* Add button to raise a ticket */}
         <Grid item xs={12} textAlign={'center'}>
          <Button component={Link} to="/tickets" sx={{ color: '80ed99' }} variant="outlined">
            Still Facing Issues? Raise a Ticket
          </Button>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Troubleshoot;