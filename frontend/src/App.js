// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import appTheme from './appTheme';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import FooterPage from './components/FooterPage';
import Dashboard from './pages/Dashboard';
import Troubleshoot from './pages/Troubleshoot';
import Tickets from './pages/Tickets';
import Home from './pages/Home';
import Guides from './pages/Guides';
import ProductPage from './pages/ProductPage';
import AboutUs from './pages/aboutus';
import NotFoundPage from './pages/NotFoundPage';
import CheckOutPage from './components/CheckOutPage';

function App() {
  const [user, setUser] = useState(null); // Initialize user state
  const [cartItems, setCartItems] = useState([]); // Initialize cartItems state

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

  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1 }}>
            <Navbar user={user} setUser={setUser} />
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
              <Route path="/products" element={<ProductPage cartItems={cartItems} handleAddToCart={handleAddToCart} handleIncreaseQuantity={handleIncreaseQuantity} handleDecreaseQuantity={handleDecreaseQuantity} />} />
              <Route path="/checkout" element={<ProtectedRoute user={user}><CheckOutPage cartItems={cartItems} handleDecreaseQuantity={handleDecreaseQuantity} handleIncreaseQuantity={handleIncreaseQuantity} /></ProtectedRoute>} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/troubleshoot" element={<Troubleshoot />} />
              <Route path="/tickets" element={<ProtectedRoute user={user}><Tickets user={user} /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute user={user}><CheckOutPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <FooterPage />
        </div>
      </Router>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ user, children }) => {
  const isAuthenticated = localStorage.getItem('jwt');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;