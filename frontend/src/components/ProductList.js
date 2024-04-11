// ProductList.js
import React, { useState } from 'react';
import { Grid, Typography, IconButton, Box, Container } from '@mui/material';
import ProductCard from './ProductCard';
import useProducts from '../hooks/useProducts';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import SearchFilter from './SearchFilter';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
const ProductList = ({ cartItems, handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity }) => {
  const { products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const mainProducts = products.filter((product) => product.category === 'main');
  const extraProducts = products.filter((product) => product.category === 'addon');
  const navigate = useNavigate(); // Add this line

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  if (isLoading) {
    return (
      <Container
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100vh', // Adjust this if you want the CircularProgress to cover a different height
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div>Error: {error}</div>
      </Container>
    );
  }

  const handleCheckoutClick = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <Container maxWidth="xl">
      <Container sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SearchFilter onSearch={handleSearch} />
        </Box>


        <IconButton
        sx={{
          display: { xs: 'none', md: 'block' },
          border: `2px solid `,
          borderColor: 'primary.main',
          backgroundColor: '#ffffff',
          borderRadius: '20%',
          marginTop:'6px'
        }}
        aria-label="Shopping Cart"
        onClick={handleCheckoutClick} // Add an onClick handler
      >
        <ShoppingBagRoundedIcon color="primary" fontSize="large" />
        {cartItems.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -8, // Adjust the top position to position the badge above the icon
              right: -8, // Adjust the right position to position the badge relative to the icon
              backgroundColor: 'red', // Example background color
              color: 'white', // Example text color
              borderRadius: '50%', // Make the badge circular
              width: 25, // Adjust the width of the badge
              height: 25, // Adjust the height of the badge
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 12, // Adjust the font size of the badge number
              
            }}
          >
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </IconButton>


      </Container>
      <Container maxWidth="xl" >
        {((searchTerm !== '' ? filteredProducts.filter((product) => product.category === 'main') : mainProducts).length > 0) && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }}>
              <strong>Our Automatic Plant Care System!</strong>
            </Typography>
            <Grid container spacing={1}>
              {(searchTerm !== '' ? filteredProducts.filter((product) => product.category === 'main') : mainProducts).map(
                (product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
                    <ProductCard
                      product={product}
                      cartItems={cartItems}
                      handleAddToCart={handleAddToCart}
                      handleIncreaseQuantity={handleIncreaseQuantity}
                      handleDecreaseQuantity={handleDecreaseQuantity}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </>
        )}
      </Container>
      <br></br>
      <Container maxWidth="xl" >
        {((searchTerm !== '' ? filteredProducts.filter((product) => product.category === 'addon') : extraProducts).length > 0) && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }}>
              <strong>Essential Companions for Your Plant Care System</strong>
            </Typography>
            <Grid container spacing={1}>
              {(searchTerm !== '' ? filteredProducts.filter((product) => product.category === 'addon') : extraProducts).map(
                (product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
                    <ProductCard
                      product={product}
                      cartItems={cartItems}
                      handleAddToCart={handleAddToCart}
                      handleIncreaseQuantity={handleIncreaseQuantity}
                      handleDecreaseQuantity={handleDecreaseQuantity}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </>
        )}
      </Container>
      {((searchTerm === '' ? mainProducts : filteredProducts.filter((product) => product.category === 'main')).length === 0 &&
        (searchTerm === '' ? extraProducts : filteredProducts.filter((product) => product.category === 'addon')).length === 0) && (
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }} textAlign={'center'}>
          <strong>Oh No! Looks like our garden's bare, no blooms in sight!</strong>
        </Typography>
      )}
    </Container>
  );
};

export default ProductList;
