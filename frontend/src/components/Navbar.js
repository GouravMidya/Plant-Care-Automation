// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/authUtils';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ user, setUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = isAuthenticated();
    setUser(storedUser);
  }, [setUser]);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    setMobileMenuOpen(false);
    setUser(null);
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const renderMobileMenu = (
    <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={handleMobileMenuClose} onKeyDown={handleMobileMenuClose}>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/products">
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/blogs">
            <ListItemText primary="Blogs" />
          </ListItem>
          <ListItem button component={Link} to="/guides">
            <ListItemText primary="Guides" />
          </ListItem>
          <ListItem button component={Link} to="/troubleshoot">
            <ListItemText primary="Troubleshoot" />
          </ListItem>
          <ListItem button component={Link} to="/tickets">
            <ListItemText primary="Tickets" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          BloomBuddy
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button component={Link} to="/dashboard" sx={{ color: 'white' }} variant="outlined">
            Dashboard
          </Button>
          <Button component={Link} to="/products" sx={{ color: 'white' }} variant="outlined">
            Products
          </Button>
          <Button component={Link} to="/blogs" sx={{ color: 'white' }} variant="outlined">
            Blogs
          </Button>
          <Button component={Link} to="/guides" sx={{ color: 'white' }} variant="outlined">
            Guides
          </Button>
          <Button component={Link} to="/troubleshoot" sx={{ color: 'white' }} variant="outlined">
            Troubleshoot
          </Button>
          <Button component={Link} to="/tickets" sx={{ color: 'white' }} variant="outlined">
            Tickets
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleMobileMenuOpen}>
                <Typography variant="body1">{user.username}</Typography>
                <MenuIcon />
              </IconButton>
              {renderMobileMenu}
            </>
          ) : (
            <Button component={Link} to="/login" sx={{ color: 'white' }} variant="outlined">
              Login
            </Button>
          )}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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