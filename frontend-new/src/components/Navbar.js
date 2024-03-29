// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/authUtils';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = isAuthenticated();
    setUser(storedUser);
  }, []); // Run this effect only once on initial render

  useEffect(() => {
    // This effect will run whenever the 'user' state changes
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    setUser(null); // Reset the user state
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          BloomBuddy
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/dashboard" sx={{ color: 'white' }} variant="outlined">
            Dashboard
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} /> {/* Add this line to center the Dashboard link */}
        <Box>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Typography variant="body1">{user.username}</Typography>
                {/* Add your desired user image here */}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} to="/login" sx={{ color: 'white' }} variant="outlined">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;