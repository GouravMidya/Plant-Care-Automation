// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import { login } from '../services/authServices';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await login(formData);
      localStorage.setItem('jwt', token);
      setUser(user); // Pass user object to setUser
      navigate('/');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Display the error message
      }
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <br/><br/>
      <Typography variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Log In
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </form>
    </Container>
  );
};

export default Login;