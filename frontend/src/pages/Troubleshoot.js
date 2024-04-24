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
      title: 'No Display on LCD Screen',
      steps: [
        'Ensure the Power is turned on.',
        'Ensure the switch the adapter is plugged to provides enough voltage current to BloomBuddy',
        'Check Power Connection: Ensure that the LCD screen is properly connected to the power source and turned on.',
        'Replace LCD display if it is damaged or faulty.'
      ],
    },
    {
      id: 2,
      title: '"Internet Not Working" Error',
      steps: [
        'Restart Router: Power cycle the router or access point to refresh the internet connection and resolve any temporary network issues.',
        'Check Wi-Fi Credentials: Verify that the Wi-Fi credentials (SSID and password) configured in the Arduino code match those of the network the device is trying to connect to.',
        'Inspect Signal Strength: Ensure that the Arduino device is within range of the Wi-Fi network and that the signal strength is sufficient for stable connectivity.',
      ],
    },
    {
      id: 3,
      title: '"Error Sending Data to Server" Error',
      steps: [
        'Check if it could be due to temporary network issues.',
        'Wait for a few moments and try again.',
        'If the problem persists, please contact customer support for assistance.'],
    },
    {
      id:4,
      title:'"Server not Reachable" Error' ,
      steps:[
        'Our server might not be reachable at the moment',
        'We apologize for inconvenience we will get it back as soon as possible'
      ]
    },
    {
      id: 5,
      title: 'Power Interruptions',
      steps: [
        'Check power connections to ensure they are secure and free from damage.',
        'Install a backup power source (e.g., battery backup) to prevent interruptions during power outages.',
      ],
    },
    {
      id:6,
      title: 'Pump not working',
      steps:[
        'Ensure the pump is suubmerged completely under water',
        'Check if the wires seem to be loose, if so correct it.',
        'Try to use other pump to see if the pump component has been damaged'
      ]
    }
    
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