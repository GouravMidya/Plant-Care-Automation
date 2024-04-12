import React, { useContext, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';

const OrderConfirmed = () => {
  const { clearCart } = useCart(); // Accessing clearCart function from CartContext

  useEffect(() => {
    // Clear the cart when the component mounts
    clearCart();
  }, [clearCart]);

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem', padding: '2rem' }}>
      <Typography variant="h2" textAlign="center" style={{ marginTop: '2rem', padding: '2rem' }}>
        Congratulations Your Order has been Confirmed!
      </Typography>
      <Typography variant="h4" textAlign="center">
        Browse through some of our other Products by clicking{' '}
        <Link to="/products" style={{ textDecoration: 'none' }}>
          here
        </Link>
      </Typography>
    </Container>
  );
};

export default OrderConfirmed;
