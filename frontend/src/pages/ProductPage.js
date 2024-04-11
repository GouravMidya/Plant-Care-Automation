import React, { useState } from 'react';
import { Typography, IconButton, Container } from '@mui/material';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import { useNavigate, Route, Routes } from 'react-router-dom'; // Import the useNavigate hook
import CheckOutPage from '../components/CheckOutPage'; // Import the CheckoutPage component
import ProductList from '../components/ProductList';

const ProductPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
 
  const handleAddToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item.product._id === product._id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { product: product, quantity: 1 }];
      setCartItems(updatedCartItems);
    }
  };
 
  const handleIncreaseQuantity = (product) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.product._id === product._id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    console.log(updatedCartItems);
  };
 
  const handleDecreaseQuantity = (product) => {
    const existingItemIndex = cartItems.findIndex((item) => item.product._id === product._id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      if (updatedCartItems[existingItemIndex].quantity > 1) {
        updatedCartItems[existingItemIndex].quantity -= 1;
      } else {
        updatedCartItems.splice(existingItemIndex, 1); // Remove the item from the cart
      }
      setCartItems(updatedCartItems);
    }
  };
 
  const handleCheckoutClick = () => {
    navigate('/checkout');
  };
 
  return (
    <div>
      <br />
      <Container>
        <Typography variant="h4" textAlign={'center'} sx={{ fontFamily: 'Pacifico, cursive' }}>
          <strong>BloomBuddy Emporium!</strong>
        </Typography>
      </Container>
      <ProductList
        cartItems={cartItems}
        handleAddToCart={handleAddToCart}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
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
        {cartItems.length > 0 && (
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
 
      {/* Render the CheckoutPage component when navigated to /checkout */}
      <Routes>
        <Route
          path="/checkout"
          element={
            <CheckOutPage cartItems={cartItems} handleDecreaseQuantity={handleDecreaseQuantity} handleIncreaseQuantity={handleIncreaseQuantity} />
          }
        />
      </Routes>
    </div>
  );
 };
 
 export default ProductPage;