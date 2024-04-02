import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const payload = {
          deviceId,
        };
        const response = await axios.post(`${API_URL}/api/user_devices/settings`, payload);
        setDevice(response.data.data);
      } catch (error) {
        console.error('Error fetching device:', error);
      }
    };
    fetchDevice();
  }, [deviceId]);

  const troubleshootingGuides = [
    {
      id: 1,
      title: 'Check Sensor Connections',
      steps: [
        'Ensure that the sensor cables are properly connected to the device.',
        'Check for any loose or damaged connections.',
        'If necessary, reconnect or replace the cables.',
      ],
    },
    {
      id: 2,
      title: 'Restart the Device',
      steps: [
        'Turn off the device and unplug it from the power source.',
        'Wait for a few seconds, then plug it back in and turn it on.',
        'Check if the device is working correctly after restarting.',
      ],
    },
    {
      id: 3,
      title: 'Check Power Supply',
      steps: [
        'Ensure that the device is receiving proper power supply.',
        'Check the power cable and connections.',
        'If necessary, replace the power cable or power source.',
      ],
    },
    {
      id: 4,
      title: 'Software Update',
      steps: [
        'Check if there are any software updates available for the device.',
        'Follow the instructions to update the device software.',
        'After updating, check if the issue is resolved.',
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
      </Grid>
    </Container>
  );
};

export default Troubleshoot;