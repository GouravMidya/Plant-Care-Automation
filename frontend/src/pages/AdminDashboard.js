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
  const [filteredOrders, setFilteredOrders] = useState({
    pending: [],
    shipped: [],
    delivered: [],
  });
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
      setFilteredOrders({ pending, shipped, delivered });
      //console.log(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredTickets  = tickets.filter((ticket) => {
      const user = ticket.user[0].username.toLowerCase();
      return user.includes(query);
    });
    const filteredPendingOrders = orders.pending.filter((order) =>
      order.userId.username.toLowerCase().includes(query)
    );

    const filteredShippedOrders = orders.shipped.filter((order) =>
      order.userId.username.toLowerCase().includes(query)
    );

    const filteredDeliveredOrders = orders.delivered.filter((order) =>
      order.userId.username.toLowerCase().includes(query)
    );
    setFilteredTickets(filteredTickets);
    setFilteredOrders({
      pending: filteredPendingOrders,
      shipped: filteredShippedOrders,
      delivered: filteredDeliveredOrders,
    });
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

  const handleShippedClick = async (order) => {
    try {
      await axios.put(`${API_URL}/orders/update-status`, {
        orderId: order._id,
        newStatus: 'Shipped',
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeliveredClick = async (order) => {
    try {
      await axios.put(`${API_URL}/orders/update-status`, {
        orderId: order._id,
        newStatus: 'Delivered',
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
          <TextField
            label="Search by username"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Tickets</Typography>
          <IconButton onClick={handleExpandTickets}>
            {expandTickets ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expandTickets} timeout="auto" unmountOnExit>
          <Grid container spacing={2}>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{ticket.user[0].username}</Typography>
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
                            mb={2} // Add some bottom margin for spacing
                            p={2} // Add some padding
                            boxShadow={3} // Add box shadow for elevation
                            borderRadius={2} // Add border radius for rounded corners
                            bgcolor="background.paper"
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
            {filteredOrders.pending.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6">{order.userId.username}</Typography>
                      <Typography variant="h6">Total Price: Rs. {order.totalPrice}</Typography>
                      <Button variant="contained" color="primary" onClick={() => handleShippedClick(order)}>
                        Shipped
                      </Button>
                    </Box>

                    {/* Render order items */}
                    {order.items.map((item) => (
                      <Box key={item._id} display="flex" alignItems="center" marginTop={2}>
                        <Box>
                          <Typography variant="subtitle1">{item.productId.name}</Typography>
                          <Typography variant="body2">Quantity: {item.quantity}</Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Render address details */}
                    <Box marginTop={2}>
                      <Typography variant="subtitle1">Address:</Typography>
                      <Typography variant="body2">{order.address.receiverName}</Typography>
                      <Typography variant="body2">{order.address.contactNumber}</Typography>
                      <Typography variant="body2">{order.address.flatNumber}, {order.address.area}</Typography>
                      <Typography variant="body2">{order.address.city}, {order.address.state}</Typography>
                      <Typography variant="body2">{order.address.country}, {order.address.pincode}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Shipped Orders</Typography>
          <Grid container spacing={2}>
            {filteredOrders.shipped.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6">{order.userId.username}</Typography>
                      <Typography variant="h6">Total Price: ${order.totalPrice}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDeliveredClick(order)}
                      >
                        Delivered
                      </Button>
                    </Box>

                    {/* Render order items */}
                    {order.items.map((item) => (
                      <Box key={item._id} display="flex" alignItems="center" marginTop={2}>
                        <Box>
                          <Typography variant="subtitle1">{item.productId.name}</Typography>
                          <Typography variant="body2">Quantity: {item.quantity}</Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Render address details */}
                    <Box marginTop={2}>
                      <Typography variant="subtitle1">Address:</Typography>
                      <Typography variant="body2">{order.address.receiverName}</Typography>
                      <Typography variant="body2">{order.address.contactNumber}</Typography>
                      <Typography variant="body2">{order.address.flatNumber}, {order.address.area}</Typography>
                      <Typography variant="body2">{order.address.city}, {order.address.state}</Typography>
                      <Typography variant="body2">{order.address.country}, {order.address.pincode}</Typography>
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
              {filteredOrders.delivered.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{order.userId.username}</Typography>
                        <Typography variant="h6">Total Price: ${order.totalPrice}</Typography>
                      </Box>

                      {/* Render order items */}
                      {order.items.map((item) => (
                        <Box key={item._id} display="flex" alignItems="center" marginTop={2}>
                          <Box>
                            <Typography variant="subtitle1">{item.productId.name}</Typography>
                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                          </Box>
                        </Box>
                      ))}

                      {/* Render address details */}
                      <Box marginTop={2}>
                        <Typography variant="subtitle1">Address:</Typography>
                        <Typography variant="body2">{order.address.receiverName}</Typography>
                        <Typography variant="body2">{order.address.contactNumber}</Typography>
                        <Typography variant="body2">{order.address.flatNumber}, {order.address.area}</Typography>
                        <Typography variant="body2">{order.address.city}, {order.address.state}</Typography>
                        <Typography variant="body2">{order.address.country}, {order.address.pincode}</Typography>
                      </Box>
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