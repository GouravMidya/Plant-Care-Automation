// ProductList.js
import React from 'react';
import { Grid, Paper } from '@mui/material';
import ProductCard from './ProductCard';
import useProducts from '../hooks/useProducts';
import CircularProgress from '@mui/material/CircularProgress';

const ProductList = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item key={product._id} xs={12} sm={6} md={6} lg={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
