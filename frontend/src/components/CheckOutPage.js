// frontend/src/components/CheckOutPage.js
import React, { useState } from 'react';
import { Container, Typography, Grid, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

const CheckOutPage = ({ cartItems, handleDecreaseQuantity, handleIncreaseQuantity }) => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePayNow = () => {
    // Redirect to payment gateway or implement payment logic
    navigate('/payment');
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Delivery Address
          </Typography>
          <textarea
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your delivery address"
            rows={4}
            style={{ width: '100%', padding: 8 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Cart Summary
          </Typography>
          {cartItems.map((item) => (
            <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <img src={`/${item.product.imageUrl}`} alt={item.product.name} style={{ width: 50, height: 50, marginRight: 8 }} />
              <div>
                <Typography variant="body1">{item.product.name}</Typography>
                <Typography variant="body2">Rs. {item.product.price}</Typography>
                <Box display="flex" alignItems="center">
                  <IconButton
                    color="primary"
                    aria-label="decrease quantity"
                    onClick={() => handleDecreaseQuantity(item.product)}
                    disabled={item.quantity === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" component="span">
                    {item.quantity}
                  </Typography>
                  <IconButton
                    color="primary"
                    aria-label="increase quantity"
                    onClick={() => handleIncreaseQuantity(item.product)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </div>
            </div>
          ))}
          <Typography variant="h6" gutterBottom>
            Total: Rs. {calculateTotalPrice()}
          </Typography>
          <button onClick={handlePayNow} style={{ padding: '8px 16px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
            Pay Now
          </button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckOutPage;
