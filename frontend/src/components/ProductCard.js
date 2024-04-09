import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Collapse, useMediaQuery, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const handleAddToCart = () => {
    setQuantity(1);
    // Add the product to the cart or list here
    const cartItem = {
      product: product,
      quantity: 1,
    };
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    // Update the quantity in the cart or list here
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Update the quantity in the cart or list here
    } else {
      setQuantity(0);
      // Remove the product from the cart or list here
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "15px"}}>
      <Card sx={{ width: '100%' }}>
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
                onClick={handleAddToCart}
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}
              >
                <AddIcon />
              </IconButton>
            ) : (
              <Box>
                <IconButton
                  color="primary"
                  aria-label="decrease quantity"
                  onClick={handleDecreaseQuantity}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" component="span">
                  {quantity}
                </Typography>
                <IconButton
                  color="primary"
                  aria-label="increase quantity"
                  onClick={handleIncreaseQuantity}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductCard;
