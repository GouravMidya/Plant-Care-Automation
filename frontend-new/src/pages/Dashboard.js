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
  TextField,
} from '@mui/material';
import { isAuthenticated, logout } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:4000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [latestRecords, setLatestRecords] = useState({});
  const [expandedDeviceId, setExpandedDeviceId] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [formData, setFormData] = useState({});
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
      await setDevices(response.data.data);
    } catch (err) {
      console.error(err); 
    }
  };

  useEffect(() => {
    const fetchLatestRecords = async () => {
      try {
        const latestRecordsData = await Promise.all(
          devices.map(async (device) => {
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
    setEditingDeviceId(deviceId);
    const device = devices.find((d) => d.deviceId === deviceId);
    setFormData({
      deviceName: device.deviceName,
      checkIntervals: device.checkIntervals,
      pumpDuration: device.pumpDuration,
      location: device.location,
      description: device.description,
    });
  };

  const handleTroubleshootClick = (deviceId) => {
    navigate(`/troubleshoot/${deviceId}`);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (deviceId) => {
    try {
      const updatedDevice = {
        deviceId,
        deviceName: formData.deviceName,
        checkIntervals: parseInt(formData.checkIntervals, 10),
        pumpDuration: parseInt(formData.pumpDuration, 10),
        location: formData.location,
        description: formData.description,
      };

      await axios.patch(`${API_BASE_URL}/api/user_devices/settings/${deviceId}`, updatedDevice);
      setEditingDeviceId(null);
      fetchUserDevices(user.id);
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const handleRaiseTicket = (deviceId) => {
    // Implement logic to raise a ticket for the device
    console.log(`Raising ticket for device ${deviceId}`);
  };

  const checkStatus = (device, latestRecord) => {
    const currentTimestamp = new Date().getTime(); // Get current timestamp in milliseconds
    console.log("Current timestamp:")
    console.log(currentTimestamp.toString())
    const lastTimestamp = new Date(latestRecord?.timestamp || 0).getTime(); // Get last timestamp in milliseconds (default to 0 if undefined)
    const checkInterval = device.checkIntervals; // Check interval in milliseconds
  
    // Check if the last timestamp plus the check interval is older than the current timestamp
    if (lastTimestamp + checkInterval < currentTimestamp) {
      return 'Off'; // Device is considered off
    } else {
      return 'On'; // Device is considered on
    }
  };


  return (
    <Container maxWidth="lg" sx={{padding:"20px"}}>
      <Grid container spacing={isLargeScreen ? 4 : 2}>
        {devices.map((device) => (
          <Grid item xs={12} md={6} key={device.deviceId}
            // sx={{ display: 'flex' }}
          >
            <Card sx={{ width: '100%' }}>
              <CardHeader
                title={device.deviceName}
                subheader={`device id: ${device.deviceId}`}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ marginRight: 1 }}>
                      Status: {latestRecords[device.deviceId]?.status || 'Off'}
                    </Typography>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: latestRecords[device.deviceId]?.status === 'On' ? 'green' : 'red',
                      }}
                    />
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
                        borderRadius: 1,
                        border: '2px solid green',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: latestRecords[device.deviceId]?.soilMoisture > 500 ? 'red' : 'green',
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
                        borderRadius: 1,
                        border: '2px solid green',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: latestRecords[device.deviceId]?.temperature > 30 ? 'red' : 'green',
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
                        borderRadius: 1,
                        border: '2px solid green',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: latestRecords[device.deviceId]?.humidity > 70 ? 'red' : 'green',
                      }}
                    >
                      {latestRecords[device.deviceId]?.humidity || '-'}
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      {editingDeviceId === device.deviceId ? (
                        <TextField
                          name="checkIntervals"
                          label="Check Interval (minutes)"
                          value={formData.checkIntervals}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                        />
                      ) : (
                        <Box>
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
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {editingDeviceId === device.deviceId ? (
                        <TextField
                        name="pumpDuration"
                        label="Pump Duration (seconds)"
                        value={formData.pumpDuration / 1000}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        />
                        ) : (
                          <Box>
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
                        </Box>
                      )}
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
                {editingDeviceId === device.deviceId ? (
                  <>
                    <Button size="small" onClick={() => setEditingDeviceId(null)}>
                      Cancel
                    </Button>
                    <Button size="small" onClick={() => handleSave(device.deviceId)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="small" onClick={() => handleEditClick(device.deviceId)}>
                      Edit Details
                    </Button>
                    <Button size="small" onClick={() => handleTroubleshootClick(device.deviceId)}>
                      Troubleshoot
                    </Button>
                    <Button size="small" onClick={() => handleRaiseTicket(device.deviceId)}>
                      Raise Ticket
                    </Button>
                  </>
                )}
              </CardActions>
              <Collapse in={expandedDeviceId === device.deviceId}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {editingDeviceId === device.deviceId ? (
                        <TextField
                        name="location"
                        label="Location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        />
                      ) : (
                        <Box>
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
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      {editingDeviceId === device.deviceId ? (
                        <TextField
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        />
                        
                      ) : (
                        <Box>
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
                        </Box>
                      )}
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
                          borderRadius: 1,
                          border: '2px solid green',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {/* Implement logic to display last pumped */}-
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Last Device Reading Time</Typography>
                      <Box
                        sx={{
                          height: 50,
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          border: '2px solid green',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {/* Implement logic to display last pumped */}
                        {latestRecords[device.deviceId]?.timestamp || '-'}
                      </Box>
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