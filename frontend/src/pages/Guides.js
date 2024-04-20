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
          heading: 'Plug the Adapter',
          description:
            'Plug the adpater of the Plant Care Automation Device into a working socket. DONT SWITCH IT ON YET',
          videoSource: '/videos/1.mp4',
        },
        {
          stepNumber: 2,
          heading: 'Insert Soil Moisture Sensor',
          description:
            'Insert the soil moisture into soil upto the white line. Make sure the electonic component remains slightly above the soil as to when the plant is watered the water does not reach it.',
          videoSource: '/videos/2.mp4',
        },
        {
          stepNumber: 3,
          heading: 'Submerge the pump in a water container',
          description: 'Submerge the pump in a water container. Make sure the water container is either placed at the same level as your plant pot or below it as keeping it above will cause the water to flow constantly.',
          videoSource: '/videos/3.mp4',
        },
        {
          stepNumber: 4,
          heading: 'Directing the Outlet Pipe',
          description: 'Direct the outlet pipe of the Pump into the plant. Make sure the water is not directly pouring on the soil moisture sensor.',
          videoSource: '/videos/4.mp4',
        },
        {
          stepNumber: 5,
          heading: 'Turn on NodeMCU',
          description: 'When you turn on NodeMCU it will look for a saved wifi network, if failed to connect it will go in Station mode. If the blue light is dim or not on then the device is in station mode and not conneted to the wifi network',
          videoSource: '/videos/5.mp4',
        },
        {
          stepNumber: 6,
          heading: 'Input wifi credentials',
          description: 'Connect to the NodeMCU by going to the wifi menu you will see "ESP8266", connect to that and a tab will open in your device showing you a wifi manager page, Click on "Configure Wifi" , Connect with the wifi network of your choice by inserting the credentials. When the device receives and connects to the wifi network wifi manager closes on the device automatically. Once this information is entered you wont need to enter it again even when you restart the device.',
          videoSource: '/videos/6.mp4',
        },
        {
          stepNumber: 7,
          heading: 'Turn On the device',
          description: 'If you see a solid blue light that means the device is connected to wifi network, the soil moisture reading is then taken and if it is low then the water pump starts which is indicated by the green light on the device thereby watering your plant . ',
          videoSource: '/videos/7.mp4',
        },
        {
          stepNumber: 8,
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