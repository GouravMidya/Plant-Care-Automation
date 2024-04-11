import React, { useState, useEffect } from 'react';
import { Paper, CardContent, CardMedia, Typography, IconButton, Box, Collapse, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../hooks/CartContext';

const ProductCard = ({ product, handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity }) => {
  const [quantity, setQuantity] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    const item = cartItems.find(item => item.product._id === product._id);
    if (item) {
      setQuantity(item.quantity);
    } else {
      setQuantity(0);
    }
  }, [cartItems, product]);

  const handleAddToCartClick = () => {
    setQuantity(quantity + 1);
    handleAddToCart(product);
  };

  const handleIncreaseQuantityClick = () => {
    setQuantity(quantity + 1);
    handleIncreaseQuantity(product);
  };

  const handleDecreaseQuantityClick = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      handleDecreaseQuantity(product);
    } else {
      setQuantity(0);
      handleDecreaseQuantity(product); // Make sure to call handleDecreaseQuantity with the product
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "10px", width: '100%' }} >
      <Paper elevation={10} sx={{ width: '100%' }}>
        <CardMedia
          component="img"
          height="auto"
          image={`/${product.imageUrl}`}
          alt={product.name}
          sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
        />
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: expanded ? 'normal' : 'nowrap' }}>
            {product.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Rs. {product.price}
          </Typography>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                maxHeight: 100,
                overflow: 'auto',
                marginTop: 1,
                paddingRight: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          </Collapse>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={handleExpandClick}
              aria-label={expanded ? 'unexpand' : 'show more'}
              sx={{ color: expanded ? 'primary.main' : 'inherit' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {quantity === 0 ? (
              <IconButton
                color="primary"
                aria-label="add to cart"
                onClick={handleAddToCartClick}
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}
              >
                <AddIcon />
              </IconButton>
            ) : (
              <Box>
                <IconButton
                  color="primary"
                  aria-label="decrease quantity"
                  onClick={handleDecreaseQuantityClick}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" component="span">
                  {quantity}
                </Typography>
                <IconButton
                  color="primary"
                  aria-label="increase quantity"
                  onClick={handleIncreaseQuantityClick}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default ProductCard;
