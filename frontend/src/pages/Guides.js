import React from 'react';
import { Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material';

const Guides = () => {


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
            'Insert the soil moisture into soil upto the white line. Make sure the electonic component remains slightly above the soil as to when the plant is watered the water does not reach it.',
          videoSource: '/videos/2.mp4',
        },
        {
          stepNumber: 2,
          heading: 'Submerge the pump in a water container',
          description: 'Submerge the pump in a water container. Make sure the water container is either placed at the same level as your plant pot or below it as keeping it above will cause the water to flow constantly.',
          videoSource: '/videos/3.mp4',
        },
        {
          stepNumber: 3,
          heading: 'Directing the Outlet Pipe',
          description: 'Direct the outlet pipe of the Pump into the plant. Make sure the water is not directly pouring on the soil moisture sensor.',
          videoSource: '/videos/4.mp4',
        },
        {
          stepNumber: 4,
          heading: 'Plug the adapter & Turn on BloomBuddy',
          description: 'When you turn on BloomBuddy it will look for a saved wifi network, if failed to connect it will go in Station mode.',
          videoSource: '/videos/4_1.mp4',
        },
        {
          stepNumber: 5,
          heading: 'Input wifi credentials',
          description: 'Connect to BloomBuddy hotspot by going to the wifi menu you will see "BloomBuddy", connect to that and a tab will open in your device showing you a wifi manager page, Click on "Configure Wifi" , Connect with the wifi network of your choice by inserting the credentials. When the device receives and connects to the wifi network, the wifi manager closes on the device automatically. Once this information is entered you wont need to enter it again even when you restart the device.',
          videoSource: '/videos/5_1.mp4',
        },
        {
          stepNumber: 6,
          heading: 'Add the Device on Dashboard',
          description: 'If the device is not already enrolled on your dashboard it will show you a message to enroll it as well as the DeviceId, Go to dashboard, click on the "+" (Add device) icon, Fill the DeviceId you see on screen and the remaining details according to your preferences.',
          videoSource: '/videos/6_1.mp4',
        },
        {
          stepNumber: 7,
          heading: 'Setup Complete',
          description: 'Congratulations the setup is now complete!',
          videoSource: '/videos/8.mp4'
        }
      ],
    }
  ];


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      {guides.map((guide) => (
        <Card key={guide.id} sx={{ marginBottom: 4,width: isXs ? '90%' : isMd ? '80%' : isLg ? '75%' : '80%', }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {guide.title}
            </Typography>
            
              
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
          </CardContent>
          
        </Card>
      ))}
    </Box>
  );
};

export default Guides;