import React, { useState } from 'react';
import { Container, TextField,Button, Typography, Grid, IconButton, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';

const CheckOutPage = () => {
    const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
    const navigate = useNavigate();
  
    const [receiverName, setReceiverName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [flatNumber, setFlatHouseNumber] = useState('');
    const [area, setLocality] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
  

  const handlePayNow = () => {
    if (cartItems.length === 0) {
        alert('Please Add Items to the Cart!');
        navigate('/products');
      } else if (
        !receiverName ||
        !contactNumber ||
        !flatNumber ||
        !area ||
        !city ||
        !state ||
        !country
      ) {
        alert('Please fill in all the fields for delivery address.');
      } else {
        navigate('/payment');
      }
    };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleDecreaseQuantity = (product) => {
    decreaseQuantity(product);
  };

  const handleIncreaseQuantity = (product) => {
    increaseQuantity(product);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom marginTop={'2rem'}>
        <strong>Checkout</strong>
      </Typography>

      <Grid container spacing={6} marginTop={'-1rem'} sx={{ paddingBottom: '2rem' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ width:{xs:'80%',md:'85%', lg:'90%'} , padding: '2rem' }}>
            <Typography variant="h6" gutterBottom>
              Delivery Address
            </Typography>
            <TextField
            label="Receiver's Name"
            fullWidth
            margin="normal"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            />
            <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            />
            <TextField
            label="Flat / House no / Floor / Building"
            fullWidth
            margin="normal"
            value={flatNumber}
            onChange={(e) => setFlatHouseNumber(e.target.value)}
            />
            <TextField
            label="Area / Sector / Locality"
            fullWidth
            margin="normal"
            value={area}
            onChange={(e) => setLocality(e.target.value)}
            />
            <TextField
            label="City"
            fullWidth
            margin="normal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />
            <TextField
            label="State"
            fullWidth
            margin="normal"
            value={state}
            onChange={(e) => setState(e.target.value)}
            />
            <TextField
            label="Country"
            fullWidth
            margin="normal"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ width:{xs:'80%',md:'85%', lg:'90%'}, padding: '2rem' }} xs={12} md={6}>
            <Typography variant="h5" gutterBottom textAlign={'center'}>
              <strong>Cart Summary</strong>
            </Typography>

            {cartItems.map((item) => (
              <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={`/${item.product.imageUrl}`} alt={item.product.name} style={{ width: 50, height: 50, marginRight: 8 }} />
                  <div>
                    <Typography variant="body1">{item.product.name}</Typography>
                    <Typography variant="body2">Rs. {item.product.price}</Typography>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      color="primary"
                      aria-label="decrease quantity"
                      onClick={() => handleDecreaseQuantity(item.product)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" component="span" style={{ margin: '0 px' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="increase quantity"
                      onClick={() => handleIncreaseQuantity(item.product)}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                  <Typography variant="body2" color="textSecondary" textAlign={'center'}>
                    Rs. {item.quantity * item.product.price}
                  </Typography>
                </div>
              </div>
            ))}

            <Typography variant="h6" gutterBottom textAlign={'right'}>
              Total: Rs. {calculateTotalPrice()}
            </Typography>
            <Grid container justifyContent="center">
              <Grid item>
                <Button onClick={handlePayNow}>
                  Pay Now
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default CheckOutPage;
