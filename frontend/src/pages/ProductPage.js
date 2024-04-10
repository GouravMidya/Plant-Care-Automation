// ProductPage.js
import React from 'react';
import ProductList from '../components/ProductList';
import { Typography,Container } from '@mui/material';
const ProductPage = () => {
  return (
    <div>
      <br></br>
      <Typography variant="h5" textAlign={'center'}><strong>Shopping Bliss: Elevating Your Plant Care Experience</strong></Typography>
      <Container xs={{maxWidth:'90%'}} md={{maxWidth:'80%'}}><ProductList /></Container>
    </div>
  );
};

export default ProductPage;
