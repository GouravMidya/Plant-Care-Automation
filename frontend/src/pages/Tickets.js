// frontend/src/pages/Tickets.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Collapse,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { API_URL } from '../utils/apiConfig';

const Tickets = ({ user }) => {
  const [currentTickets, setCurrentTickets] = useState([]);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [openRaiseTicketDialog, setOpenRaiseTicketDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contactDetails: '',
    deviceId: '',
  });
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchTickets();
    }

    const { state } = location;
    if (state && state.raiseTicket) {
      handleOpenRaiseTicketDialog(state.deviceId);
    }
  }, [user, location]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets?userId=${user.id}`);
      const { currentTickets, ticketHistory } = response.data;
      setCurrentTickets(currentTickets);
      setTicketHistory(ticketHistory);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleOpenRaiseTicketDialog = (deviceId) => {
    setFormData({ ...formData,
      deviceId: deviceId || '', // Set deviceId if provided, otherwise set an empty string
      });
    setOpenRaiseTicketDialog(true);
  };

  const handleCloseRaiseTicketDialog = () => {
    setOpenRaiseTicketDialog(false);
    setFormData({
      title: '',
      description: '',
      location: '',
      contactDetails: '',
      deviceId: '',
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRaiseTicket = async () => {
    try {
      const ticketData = {
        ...formData,
        userId: user.id,
      };
      await axios.post(`${API_URL}/api/tickets`, ticketData);
      handleCloseRaiseTicketDialog();
      fetchTickets();
    } catch (error) {
      console.error('Error raising ticket:', error);
    }
  };

  const handleExpandClick = (ticketId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [ticketId]: !prevExpanded[ticketId],
    }));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={6} >
          <Typography variant="h4" gutterBottom>
            Tickets
          </Typography>
        </Grid>
        <Grid item xs={6}  textAlign={{ sm: 'right' }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenRaiseTicketDialog()}>
            Raise Ticket
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5">Current Tickets</Typography>
        <Grid container spacing={2}>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <Grid item xs={12} sm={6} key={ticket._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography variant="body2">{ticket.description}</Typography>
                    <Typography variant="body2">Device ID: {ticket.deviceId}</Typography>
                    <Typography variant="body2">
                      Current Status: {ticket.status[ticket.status.length - 1].status}
                    </Typography>
                    <IconButton
                      onClick={() => handleExpandClick(ticket._id)}
                      aria-expanded={expanded[ticket._id]}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    <Collapse in={expanded[ticket._id]} timeout="auto" unmountOnExit>
                      {ticket.status.map((statusObj, index) => (
                        <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column', // Change flex direction to column
                          marginBottom: 1,
                          padding: 1,
                          backgroundColor: index === ticket.status.length - 1 ? '#f5f5f5' : 'white',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column', // Change flex direction to column
                            alignItems: 'flex-start', // Align items to the start of the column
                            marginBottom: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {index === ticket.status.length - 1 ? (
                              <AccessTimeIcon sx={{ marginRight: 1 }} />
                            ) : (
                              <CheckCircleIcon sx={{ marginRight: 1, color: 'green' }} />
                            )}
                            <Typography variant="body2">
                              Status: {statusObj.status}
                            </Typography>
                          </Box>
                          {statusObj.remarks && (
                            <Typography variant="body2">
                              Remarks: {statusObj.remarks}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            Updated At:
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right' }}>
                            {new Date(statusObj.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      
                      
                      ))}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} justifyContent="center" textAlign="center">
              <Box height="200px" display="flex" alignItems="center" justifyContent="center">
                <Typography variant="body1">No Current Open Tickets.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5">Ticket History</Typography>
        <Grid container spacing={2}>
          {ticketHistory.length > 0 ? (
            ticketHistory.map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography variant="body2">{ticket.description}</Typography>
                    <Typography variant="body2">Device ID: {ticket.deviceId}</Typography>
                    <Typography variant="body2">
                      Current Status: {ticket.status[ticket.status.length - 1].status}
                    </Typography>
                    <IconButton
                      onClick={() => handleExpandClick(ticket._id)}
                      aria-expanded={expanded[ticket._id]}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    <Collapse in={expanded[ticket._id]} timeout="auto" unmountOnExit>
                      {ticket.status.map((statusObj, index) => (
                        <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column', // Change flex direction to column
                          marginBottom: 1,
                          padding: 1,
                          backgroundColor: index === ticket.status.length - 1 ? '#f5f5f5' : 'white',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column', // Change flex direction to column
                            alignItems: 'flex-start', // Align items to the start of the column
                            marginBottom: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {index === ticket.status.length - 1 ? (
                              <AccessTimeIcon sx={{ marginRight: 1 }} />
                            ) : (
                              <CheckCircleIcon sx={{ marginRight: 1, color: 'green' }} />
                            )}
                            <Typography variant="body2">
                              Status: {statusObj.status}
                            </Typography>
                          </Box>
                          {statusObj.remarks && (
                            <Typography variant="body2">
                              Remarks: {statusObj.remarks}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            Updated At:
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right' }}>
                            {new Date(statusObj.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      ))}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} justifyContent="center" textAlign="center">
              <Box height="200px" display="flex" alignItems="center" justifyContent="center">
                <Typography variant="body1">No ticket history.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={openRaiseTicketDialog} onClose={handleCloseRaiseTicketDialog}>
        <DialogTitle>Raise Ticket</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            />
          <TextField
            name="contactDetails"
            label="Contact Details"
            value={formData.contactDetails}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRaiseTicketDialog}>Cancel</Button>
          <Button onClick={handleRaiseTicket}>Raise Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
            
export default Tickets;