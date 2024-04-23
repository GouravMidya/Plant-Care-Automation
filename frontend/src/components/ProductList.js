// ProductList.js
import React, { useState } from 'react';
import { Grid, Typography, IconButton, Box, Container, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';
import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';

const ProductList = ({ cartItems, handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity }) => {
  const { products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
    setLoading(true); // Set loading state to true
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );

    // Sort the filtered products based on their name
    const sortedProducts = filtered.sort((a, b) => {
      const aStartsWithTerm = a.name.toLowerCase().startsWith(term.toLowerCase());
      const bStartsWithTerm = b.name.toLowerCase().startsWith(term.toLowerCase());

      if (aStartsWithTerm && !bStartsWithTerm) {
        return -1; // 'a' comes before 'b'
      }
      if (!aStartsWithTerm && bStartsWithTerm) {
        return 1; // 'b' comes before 'a'
      }
      return a.name.localeCompare(b.name); // Sort alphabetically for other cases
    });

    setFilteredProducts(sortedProducts);
    // Simulate a delay to demonstrate the loading animation
    setTimeout(() => {
      setLoading(false); // Set loading state to false after the search operation is completed
    }, 500); // Adjust the duration of the delay as needed
  };

  if (isLoading) {
    return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          flexDirection="column"
        >
          <CircularProgress size={80} />
          <Typography variant="h5" mt={2}>
            Please wait while we fetch our Products
          </Typography>
        </Box>
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
    navigate('/checkout');
  };

  return (
    <Container maxWidth="xl" sx={{paddingBottom:'2rem'}}>
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
            marginTop: '6px',
          }}
          aria-label="Shopping Cart"
          onClick={handleCheckoutClick}
        >
          <ShoppingBagRoundedIcon color="primary" fontSize="large" />
          {cartItems.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                width: 25,
                height: 25,
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
      </Container>
      {loading ? ( // Conditional rendering of loading animation
        <Container
          style={{
            display: 'grid',
            placeItems: 'center',
            height: '50vh', // Adjust this if you want the CircularProgress to cover a different height
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
        <>
          {/* Display main and addon products separately when no search term */}
          {searchTerm === '' && (
            <>
              {products.filter((product) => product.category === 'main').length > 0 && (
                <>
                  <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }}>
                    <strong>Our Automatic Plant Care System!</strong>
                  </Typography>
                  <Grid container spacing={1}>
                    {products.filter((product) => product.category === 'main').map((product) => (
                      <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
                        <ProductCard
                          product={product}
                          cartItems={cartItems}
                          handleAddToCart={handleAddToCart}
                          handleIncreaseQuantity={handleIncreaseQuantity}
                          handleDecreaseQuantity={handleDecreaseQuantity}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {products.filter((product) => product.category === 'addon').length > 0 && (
                <>
                  <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }}>
                    <strong>Essential Companions for Your Plant Care System</strong>
                  </Typography>
                  <Grid container spacing={1}>
                    {products.filter((product) => product.category === 'addon').map((product) => (
                      <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
                        <ProductCard
                          product={product}
                          cartItems={cartItems}
                          handleAddToCart={handleAddToCart}
                          handleIncreaseQuantity={handleIncreaseQuantity}
                          handleDecreaseQuantity={handleDecreaseQuantity}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </>
          )}

          {/* Display all products in a single line when a search term is present */}
          {searchTerm !== '' && (
            <Grid container spacing={1}>
              {filteredProducts.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
                  <ProductCard
                    product={product}
                    cartItems={cartItems}
                    handleAddToCart={handleAddToCart}
                    handleIncreaseQuantity={handleIncreaseQuantity}
                    handleDecreaseQuantity={handleDecreaseQuantity}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Display a message when no products are found */}
          {((searchTerm === '' ? products.filter((product) => product.category === 'main') : filteredProducts.filter((product) => product.category === 'main')).length === 0 &&
            (searchTerm === '' ? products.filter((product) => product.category === 'addon') : filteredProducts.filter((product) => product.category === 'addon')).length === 0) && (
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Arial, cursive' }} textAlign={'center'}>
              <strong>Oh No! Looks like our garden's bare, no blooms in sight!</strong>
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList;