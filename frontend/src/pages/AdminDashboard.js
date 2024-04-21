import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField as TextFieldMUI,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { API_URL } from '../utils/apiConfig';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState({ pending: [], shipped: [], delivered: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [expandTickets, setExpandTickets] = useState(false);
  const [expandOrders, setExpandOrders] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newRemark, setNewRemark] = useState('');

  useEffect(() => {
    fetchTickets();
    fetchOrders();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/admin`);
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleExpandClick = (ticketId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [ticketId]: !prevExpanded[ticketId],
    }));
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      const { pending, shipped, delivered } = response.data;
      setOrders({ pending, shipped, delivered });
      //console.log(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    //console.log(orders)
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tickets.filter((ticket) => {
      const user = ticket.userId.name.toLowerCase();
      return user.includes(query);
    });

    setFilteredTickets(filtered);
  };

  const handleExpandTickets = () => {
    setExpandTickets((prevState) => !prevState);
  };

  const handleExpandOrders = () => {
    setExpandOrders((prevState) => !prevState);
  };

  const handleStatusChange = (ticketId, ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const updatedData = {
        status: newStatus,
        remarks: newRemark,
      };

      await axios.patch(`${API_URL}/api/tickets/${selectedTicket._id}`, updatedData);
      setOpenDialog(false);
      setNewStatus('');
      setNewRemark('');
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStatus('');
    setNewRemark('');
  };

  const handleShippedClick = async (orderId) => {
    try {
      await axios.put(`${API_URL}/orders/update-status`, {
        orderId,
        newStatus: 'shipped',
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeliveredClick = async (orderId) => {
    try {
      await axios.put(`${API_URL}/orders/update-status`, {
        orderId,
        newStatus: 'delivered',
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Tickets</Typography>
          <IconButton onClick={handleExpandTickets}>
            {expandTickets ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expandTickets} timeout="auto" unmountOnExit>
          <TextField
            label="Search by username"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          <Grid container spacing={2}>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">User</Typography>
                      <IconButton
                        onClick={() => handleExpandClick(ticket._id)}
                        aria-expanded={expanded[ticket._id]}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                      <Collapse in={expanded[ticket._id]} timeout="auto" unmountOnExit>
                        {ticket.tickets.map((ticketData) => (
                          <Box
                            key={ticketData._id}
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                              <Typography variant="h6">{ticketData.title}</Typography>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleStatusChange(ticketData._id, ticketData)}
                              >
                                Update
                              </Button>
                            </Box>
                            <Typography variant="body2">{ticketData.description}</Typography>
                            <Typography variant="body2">Device ID: {ticketData.deviceId}</Typography>
                            <Typography variant="body2">
                              Status: {ticketData.status[ticketData.status.length - 1].status}
                            </Typography>
                            <Typography variant="body2">
                              Remarks: {ticketData.status[ticketData.status.length - 1].remarks || 'N/A'}
                            </Typography>
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
                  <Typography variant="body1">No tickets found.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Orders</Typography>
          <IconButton onClick={handleExpandOrders}>
            {expandOrders ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expandOrders} timeout="auto" unmountOnExit>
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6">Pending Orders</Typography>
              <Grid container spacing={2}>
                {orders.pending.map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6">{order.items[0].productId.name}</Typography>
                          <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleShippedClick(order._id)}
                          >
                          Shipped
                          </Button>
                        </Box>
                      {/* Render other order details */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
                  <Typography variant="h6">Shipped Orders</Typography>
                  <Grid container spacing={2}>
                    {orders.shipped.map((order) => (
                      <Grid item xs={12} sm={6} md={4} key={order._id}>
                        <Card>
                          <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="h6">{order.items[0].productId.name}</Typography>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDeliveredClick(order._id)}
                              >
                                Delivered
                              </Button>
                            </Box>
                            {/* Render other order details */}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ marginTop: '20px' }}>
                  <Typography variant="h6">Delivered Orders</Typography>
                  <Grid container spacing={2}>
                    {orders.delivered.map((order) => (
                      <Grid item xs={12} sm={6} md={4} key={order._id}>
                        <Card>
                          <CardContent>
                            {/* Render order details */}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Collapse>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Awaiting Customer Response">Awaiting Customer Response</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
              <MenuItem value="Escalated">Escalated</MenuItem>
              <MenuItem value="Pending Approval">Pending Approval</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Reopened">Reopened</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Duplicate">Duplicate</MenuItem>
            </Select>
          </FormControl>
          <TextFieldMUI
            label="Remark"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} disabled={!newStatus}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;