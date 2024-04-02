import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Collapse, useMediaQuery } from '@mui/material';

const Guides = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);


  const isXs = useMediaQuery('(max-width:599px)');
  const isMd = useMediaQuery('(min-width:600px) and (max-width:959px)');
  const isLg = useMediaQuery('(min-width:960px)');

  const guides = [
    {
      id: 1,
      title: 'Setting up your device',
      steps: [
        {
          stepNumber: 1,
          heading: 'Insert Soil Moisture Sensor',
          description:
            'Insert the half of the black part of the soil moisture sensor in the soil of the pot you want to automate care for',
          videoSource: '/videos/waves_video.mp4',
        },
        {
          stepNumber: 2,
          heading: 'Submerge the pump in a water container',
          description: 'Submerge the pump in a water container and put the pipe in your pot',
          videoSource: '/videos/mountains.mp4',
        },
        {
          stepNumber: 3,
          heading: 'Turn on NodeMCU',
          description: 'When you turn on NodeMCU it will look for a saved wifi network, if failed to connect it will go in Station mode',
          videoSource: '/videos/mountains.mp4',
        },
        {
          stepNumber: 4,
          heading: 'Input wifi credentials',
          description: 'Connect to NodeMCU and you will find a tab open in your browser showing you the list of available networks , Connect with the wifi network of your choice by inserting the credentials',
          videoSource: '/videos/mountains.mp4',
        },
        {
          stepNumber: 5,
          heading: 'Check for Blue light',
          description: 'If you see a solid blue light that means the device is connected to wifi network',
          videoSource: '/videos/mountains.mp4',
        },
        {
          stepNumber: 6,
          heading: 'Sit back and relax',
          description: 'Your NodeMCU will automatically pump water for your plants when they are thristy, You can view all the details and history in the dashboard window',
          videoSource: '/videos/mountains.mp4',
        },
      ],
    },
    {
      id: 2,
      title: 'Adding multiple sensors to your device',
      steps: [
        // Add steps for Guide 2 here
        {
            stepNumber: 1,
            heading: 'Insert Soil Moisture Sensor',
            description:
              'Insert the half of the black part of the soil moisture sensor in the soil of the pot you want to automate care for',
            videoSource: '/videos/waves_video.mp4',
        },
      ],
    },
    // Add more guides as needed
  ];

  const handleGuideExpand = (guideId) => {
    setExpandedGuide(guideId === expandedGuide ? null : guideId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      {guides.map((guide) => (
        <Card key={guide.id} sx={{ marginBottom: 4,width: isXs ? '90%' : isMd ? '80%' : isLg ? '75%' : '80%', }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {guide.title}
            </Typography>
            <Collapse in={expandedGuide === guide.id} timeout={300} unmountOnExit>
              <Box sx={{ marginTop: 2 }}>
                {guide.steps.map((step) => (
                  <Card key={step.stepNumber} sx={{ marginBottom: 4 }}>
                    <CardContent>
                      <Typography variant="h6" color="#008000" gutterBottom>
                        Step {step.stepNumber}: {step.heading}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }} >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '56.25%',
                          }}
                        >
                          <video
                            src={step.videoSource}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                            }}
                            controls
                          />
                        </Box>
                      </Box>
                      <Typography variant="body1">{step.description}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Collapse>
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
            <Button onClick={() => handleGuideExpand(guide.id)}>
              {expandedGuide === guide.id ? 'Collapse' : 'Expand'}
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default Guides;