// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import appTheme from './appTheme';
import Homepage from './components/Homepage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Troubleshoot from './pages/Troubleshoot';
import Tickets from './pages/Tickets';
import Home from './pages/Home';
import Guides from './pages/Guides';

function App() {
  const [user, setUser] = useState(null); // Initialize user state
  
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1 }}>
            <Navbar user={user} setUser={setUser}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser}/> } />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/troubleshoot" element={<Troubleshoot />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/tickets" element={<ProtectedRoute user={user}><Tickets user={user} /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('jwt');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;