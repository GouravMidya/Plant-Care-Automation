import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SoilMoistureChart from '../components/SoilMoistureChart'; // Import the SoilMoistureChart component
import TemperatureChart from '../components/TemperatureChart'; // Import the SoilMoistureChart component
import PumpHistoryChart from '../components/PumpHistoryChart';
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
  CircularProgress,
  Fab,
} from '@mui/material';
import { isAuthenticated } from '../utils/authUtils';
import { API_URL } from '../utils/apiConfig';
import AddIcon from '@mui/icons-material/Add';
import { maxSoilMoisture } from '../utils/apiConfig';
import { minSoilMoisture } from '../utils/apiConfig';
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [latestRecords, setLatestRecords] = useState({});
  const [expandedDeviceId, setExpandedDeviceId] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await axios.get(`${API_URL}/api/user_devices?userId=${userId}`);
      await setDevices(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err); 
      setIsLoading(false);
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
            const sensorReadingResponse = await axios.post(`${API_URL}/sensor_readings/latest`, payload);
            const sensorData = sensorReadingResponse.data.data;
  
            let pumpData = null;
            let pumpTimestamp = null;
            try {
              const pumpHistoryResponse = await axios.post(`${API_URL}/pump/latest`, payload);
              pumpData = pumpHistoryResponse.data.data;
              pumpTimestamp = pumpData?.timestamp; // Separate the pump timestamp from the pump data object
            } catch (error) {
              console.error(`Error fetching latest pump history for device ${device.deviceId}:`, error);
            }
  
            return {
              [device.deviceId]: {
                ...sensorData,
                pumpData,
                sensorTimestamp: sensorData?.timestamp, // Store the sensor timestamp separately
                pumpTimestamp,
              },
            };
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
    const interval = setInterval(fetchLatestRecords, 600000); // Fetch data every 10 minutes
  
    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [devices]); // Only run the effect when the devices array changes
  

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
      threshold: device.threshold,
      location: device.location,
      description: device.description,
    });
  };

  const handleTroubleshootClick = () => {
    navigate('/troubleshoot');
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
        threshold: formData.threshold,
        location: formData.location,
        description: formData.description,
      };

      await axios.patch(`${API_URL}/api/user_devices/settings/${deviceId}`, updatedDevice);
      setEditingDeviceId(null);
      fetchUserDevices(user.id);
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const handleRaiseTicket = (deviceId) => {
    navigate('/tickets', { state: { deviceId, raiseTicket: true } });
  };

  const checkStatus = (device, latestRecord) => {
    const currentTimestamp = new Date().getTime(); // Get current timestamp in milliseconds
    const lastTimestamp = new Date(latestRecord?.timestamp || 0).getTime(); // Get last timestamp in milliseconds (default to 0 if undefined)
    const checkInterval = device.checkIntervals * 60 * 1000; // Convert check interval from minutes to milliseconds
    
    // Check if the last timestamp plus the check interval is older than the current timestamp
    if (lastTimestamp + checkInterval + 60000 < currentTimestamp) {
      return 'Off'; // Device is considered off
    } else {
      return 'On'; // Device is considered on
    }
  };

  const handleAddDevice = () => {
    navigate('/dashboard/addDevice');
  };


  return (
    <Container maxWidth="lg" sx={{padding:"20px"}}>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          flexDirection="column"
        >
          <CircularProgress size={80} />
          <Typography variant="h5" mt={2}>
            Please wait while we fetch your devices
          </Typography>
        </Box>
      ) : devices.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          flexDirection="column"
        >
          <Typography variant="h5" textAlign="center">
            Looks empty here, Consider buying our product and if you have already bought one then tap on add device
          </Typography>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddDevice}
            sx={{ marginTop: '1rem' }}
          >
            <AddIcon />
          </Fab>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Fab color="primary" aria-label="add" onClick={handleAddDevice}>
              <AddIcon />
            </Fab>
          </Box>
      <Grid container spacing={isLargeScreen ? 4 : 2}>
        {devices.map((device) => (
          <Grid item xs={12} md={6} key={device.deviceId}
            // sx={{ display: 'flex' }}
          >
            <Card sx={{ width: '100%' }}  elevation={8}>
              <CardHeader
                title={device.deviceName}
                subheader={`device id: ${device.deviceId}`}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ marginRight: 1 }}>
                    Status: {checkStatus(device, latestRecords[device.deviceId]) || 'Off'}
                  </Typography>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor:
                        checkStatus(device, latestRecords[device.deviceId]) === 'On' ? 'green' : 'red',
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
                        color: ((1-(latestRecords[device.deviceId]?.soilMoisture -minSoilMoisture)/(maxSoilMoisture-minSoilMoisture))*100) < device.threshold ? 'red' : 'green',
                      }}
                    >
                          {((1-(latestRecords[device.deviceId]?.soilMoisture -minSoilMoisture)/(maxSoilMoisture-minSoilMoisture))*100).toFixed(2)+'%'|| '-'}
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
                            {device.checkIntervals} m
                          </Box>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {editingDeviceId === device.deviceId ? (
                        <TextField
                        name="pumpDuration"
                        label="Pump Duration (seconds)"
                        value={formData.pumpDuration}
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
                            {device.pumpDuration} s
                          </Box>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                    {editingDeviceId === device.deviceId ? (
                        <TextField
                        name="threshold"
                        label="Watering Threshold (%)"
                        value={formData.threshold}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        />
                        ) : (
                          <Box>
                          <Typography variant="body2">Watering threshold (%)</Typography>
                          <Box
                            sx={{
                              height: 50,
                              backgroundColor: 'grey.200',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {device.threshold}%
                          </Box>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <CardActions>
                <Grid container spacing={1}>
                  <Grid item xs={6} >
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => handleExpandClick(device.deviceId)}
                    >
                      {expandedDeviceId === device.deviceId ? 'Collapse' : 'Expand'}
                    </Button>
                  </Grid>
                  {editingDeviceId === device.deviceId ? (
                    <>
                      <Grid item xs={3} >
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => setEditingDeviceId(null)}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item xs={3} >
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => handleSave(device.deviceId)}
                        >
                          Save
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={6} >
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => handleEditClick(device.deviceId)}
                        >
                          Edit Details
                        </Button>
                      </Grid>
                      <Grid item xs={6} >
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => handleTroubleshootClick(device.deviceId)}
                        >
                          Troubleshoot
                        </Button>
                      </Grid>
                      <Grid item xs={6} >
                        <Button
                          fullWidth
                          size="small"
                          onClick={() => handleRaiseTicket(device.deviceId)}
                        >
                          Raise Ticket
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
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
                        {latestRecords[device.deviceId]?.pumpTimestamp
      ? new Date(latestRecords[device.deviceId].pumpTimestamp).toLocaleString()
      : '-'}
                        
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
                        {latestRecords[device.deviceId]?.sensorTimestamp
                          ? new Date(latestRecords[device.deviceId].sensorTimestamp).toLocaleString()
                          : '-'}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{marginTop:'2rem'}}>
                    <Typography variant="h6"><strong>Soil Moisture Chart</strong></Typography>
                      <SoilMoistureChart deviceId={device.deviceId} /> 
                    </Grid>
                    <Grid item xs={12} sx={{marginTop:'1rem'}}>
                    <Typography variant="h6"><strong>Temperature Chart</strong></Typography>
                      <TemperatureChart deviceId={device.deviceId} /> 
                    </Grid>
                    <Grid item xs={12} sx={{marginTop:'1rem'}}>
                    <Typography variant="h6"><strong>Pump History Chart</strong></Typography>
                      <PumpHistoryChart deviceId={device.deviceId} /> 
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
      </>
      )}
    </Container>
  );
};

export default Dashboard;