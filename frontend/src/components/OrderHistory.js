import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import { API_URL } from '../utils/apiConfig';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { green } from '@mui/material/colors';

const OrderHistory = ({ user }) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${user.id}`);
        const orders = response.data;
        const current = orders.filter(order => order.status[order.status.length - 1].status !== 'delivered');
        const past = orders.filter(order => order.status[order.status.length - 1].status === 'delivered');
        setCurrentOrders(current);
        setPastOrders(past);
        setLoading(false);
        console.log("Fetching successfully: ", response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleExpandClick = (orderId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [orderId]: !prevExpanded[orderId],
    }));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h5">Current Orders</Typography>
            <Grid container spacing={2}>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Order ID: {order._id}</Typography>
                        <Typography variant="body2">Total Price: ${order.totalPrice}</Typography>
                        <Typography variant="body2">
                          Status: {order.status[order.status.length - 1].status}
                        </Typography>
                        <IconButton
                          onClick={() => handleExpandClick(order._id)}
                          aria-expanded={expanded[order._id]}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                        <Collapse in={expanded[order._id]} timeout="auto" unmountOnExit>
                          <Typography variant="body2">Items:</Typography>
                          {order.items.map(item => (
                            <Typography variant="body2" key={item.productId._id}>
                              {item.quantity}x {item.productId.name}
                            </Typography>
                          ))}
                          {order.status.map((statusObj, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 1,
                                padding: 1,
                                backgroundColor: index === order.status.length - 1 ? '#f5f5f5' : 'white',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexGrow: 1,
                                }}
                              >
                                {index === order.status.length - 1 ? (
                                  <AccessTimeIcon sx={{ marginRight: 1 }} />
                                ) : (
                                  <CheckCircleIcon sx={{ marginRight: 1, color: green[500] }} />
                                )}
                                <Typography variant="body2">
                                  {statusObj.status}
                                  {statusObj.remarks && ` - Remarks: ${statusObj.remarks}`}
                                </Typography>
                              </Box>
                              <Typography variant="body2">
                                Updated At: {new Date(statusObj.updatedAt).toLocaleString()}
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
                    <Typography variant="body1">No Current Orders.</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="h5">Past Orders</Typography>
            <Grid container spacing={2}>
              {pastOrders.length > 0 ? (
                pastOrders.map((order) => (
                  <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Order ID: {order._id}</Typography>
                        <Typography variant="body2">Total Price: ${order.totalPrice}</Typography>
                        <Typography variant="body2">
                          Status: {order.status[order.status.length - 1].status}
                        </Typography>
                        <IconButton
                          onClick={() => handleExpandClick(order._id)}
                          aria-expanded={expanded[order._id]}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                        <Collapse in={expanded[order._id]} timeout="auto" unmountOnExit>
                          <Typography variant="body2">Items:</Typography>
                          {order.items.map(item => (
                            <Typography variant="body2" key={item.productId._id}>
                              {item.quantity}x {item.productId.name}
                            </Typography>
                          ))}
                          {order.status.map((statusObj, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 1,
                                padding: 1,
                                backgroundColor: index === order.status.length - 1 ? '#f5f5f5' : 'white',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexGrow: 1,
                                }}
                              >
                                {index === order.status.length - 1 ? (
                                  <CheckCircleIcon sx={{ marginRight: 1, color: green[500] }} />
                                ) : (
                                  <CheckCircleIcon sx={{ marginRight: 1, color: green[500] }} />
                                )}
                                <Typography variant="body2">
                                  {statusObj.status}
                                  {statusObj.remarks && ` - Remarks: ${statusObj.remarks}`}
                                </Typography>
                              </Box>
                              <Typography variant="body2">
                                Updated At: {new Date(statusObj.updatedAt).toLocaleString()}
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
        <Typography variant="body1">No Past Orders.</Typography>
      </Box>
    </Grid>
  )}
  </Grid>
  </Box>
  </div>
)}
              </div>
              );
};

export default OrderHistory;