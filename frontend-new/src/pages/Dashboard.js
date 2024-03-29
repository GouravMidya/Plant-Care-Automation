import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Collapse,
  Container,
  useMediaQuery,
} from '@mui/material';
import { isAuthenticated, logout } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:4000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [latestRecords, setLatestRecords] = useState({});
  const [expandedDeviceId, setExpandedDeviceId] = useState(null);
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    const user = isAuthenticated();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
      fetchUserDevices(user.id);
    }
  }, [navigate]);

  const fetchUserDevices = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user_devices?userId=${userId}`);
      //console.log(response)
      await setDevices(response.data.data);
      //console.log("Devices ")
      //console.log(devices)
    } catch (err) {
      console.error(err); 
    }
  };

  useEffect(() => {
    const fetchLatestRecords = async () => {
      try {
        const latestRecordsData = await Promise.all(
          devices.map(async (device) => {
            console.log(device.deviceId)
            const payload = {
              deviceId: device.deviceId.toString(),
            };
            const response = await axios.post(`${API_BASE_URL}/sensor_readings/latest`,payload);
            const data = response.data.data;
            return { [device.deviceId]: data };
          })
        );
        const latestRecordsObj = latestRecordsData.reduce((obj, record) => {
          return { ...obj, ...record };
        }, {});
        setLatestRecords(latestRecordsObj);
      } catch (error) {
        console.error('Error fetching latest records:', error);
      }
    };
    fetchLatestRecords();
  }, [devices]);


  const handleExpandClick = (deviceId) => {
    setExpandedDeviceId(deviceId === expandedDeviceId ? null : deviceId);
  };

  const handleEditClick = (deviceId) => {
    // Implement logic to navigate to the edit device page
  };

  const handleTroubleshootClick = (deviceId) => {
    // Implement logic to troubleshoot the device
  };

  return (
    <Container maxWidth="lg" sx={{padding:"20px"}}>
      <Grid container spacing={isLargeScreen ? 4 : 2}>
        {devices.map((device) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={device.deviceId}
            // sx={{ display: 'flex' }}
          >
            <Card sx={{ width: '100%' }}>
              <CardHeader
                title={device.deviceName}
                subheader={`device id: ${device.deviceId}`}
                action={
                  <Box>
                    <Typography variant="body1">
                      Status: {latestRecords[device.deviceId]?.status || 'Off'}
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2">Moisture</Typography>
                    <Box
                      sx={{
                        height: 50,
                        backgroundColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {latestRecords[device.deviceId]?.soilMoisture || '-'}
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Temperature</Typography>
                    <Box
                      sx={{
                        height: 50,
                        backgroundColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {latestRecords[device.deviceId]?.temperature || '-'}
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">Humidity</Typography>
                    <Box
                      sx={{
                        height: 50,
                        backgroundColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {latestRecords[device.deviceId]?.humidity || '-'}
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2">Check Interval</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {device.checkIntervals / 60000} m
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">Pump Duration</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {device.pumpDuration / 1000} s
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">Threshold</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Implement logic to display threshold */}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleExpandClick(device.deviceId)}
                >
                  {expandedDeviceId === device.deviceId ? 'Collapse' : 'Expand'}
                </Button>
                <Button
                  size="small"
                  onClick={() => handleEditClick(device.deviceId)}
                >
                  Edit Details
                </Button>
              </CardActions>
              <Collapse in={expandedDeviceId === device.deviceId}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body1">Location</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {device.location}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Description</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {device.description}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Last Pumped</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Implement logic to display last pumped */}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={() => handleTroubleshootClick(device.deviceId)}
                      >
                        Troubleshoot
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;