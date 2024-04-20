//ProductPage.js
import React from 'react';
import { Typography, IconButton, Container } from '@mui/material';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useCart } from '../hooks/CartContext';

const ProductPage = () => {
  const { cartItems, addToCart, decreaseQuantity, increaseQuantity } = useCart(); // Use useCart hook to access cartItems state, addToCart, and decreaseQuantity functions
  const navigate = useNavigate();
 
  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  // Define handleAddToCart function
  const handleAddToCart = (product) => {
    addToCart(product); // Call the addToCart function from useCart hook
  };

  const handleIncreaseQuantity = (product) => {
    increaseQuantity(product); // Call the decreaseQuantity function from useCart hook
  };

  // Define handleDecreaseQuantity function
  const handleDecreaseQuantity = (product) => {
    decreaseQuantity(product); // Call the decreaseQuantity function from useCart hook
  };
 
  return (
    <div>
      <br />
      <Container >
        <Typography variant="h4" textAlign={'center'} sx={{ fontFamily: 'Pacifico, cursive' }}>
          <strong>BloomBuddy Emporium!</strong>
        </Typography>
      </Container>
      <ProductList
        cartItems={cartItems}
        handleAddToCart={handleAddToCart} // Pass handleAddToCart function to ProductList component
        handleDecreaseQuantity={handleDecreaseQuantity} // Pass handleDecreaseQuantity function to ProductList component
        handleIncreaseQuantity={handleIncreaseQuantity}
      />
      <IconButton
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          border: `2px solid `,
          borderColor: 'primary.main',
          backgroundColor: '#ffffff',
          bottom: '1.5rem',
          right: '1.5rem',
          borderRadius: '50%',
        }}
        aria-label="Shopping Cart"
        onClick={handleCheckoutClick}
      >
        <ShoppingBagRoundedIcon color="primary" fontSize="large" />
        {cartItems && cartItems.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 12,
            }}
          >
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </IconButton>
    </div>
  );
};
 
export default ProductPage;
