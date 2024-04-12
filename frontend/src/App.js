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
import AddDevice from './pages/AddDevice';
import { CartProvider } from './hooks/CartContext';

function App() {
  const [user, setUser] = useState(null); // Initialize user state

  return (
    <ThemeProvider theme={appTheme}>
      <CartProvider> {/* Wrap your app with CartProvider */}
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
              <Navbar user={user} setUser={setUser} />
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/addDevice" element={<ProtectedRoute user={user}><AddDevice /></ProtectedRoute>} />
                <Route path="/products" element={<ProductPage />} />
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
      </CartProvider>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ user, children }) => {
  const isAuthenticated = localStorage.getItem('jwt');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;