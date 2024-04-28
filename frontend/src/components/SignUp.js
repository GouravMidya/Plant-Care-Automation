// frontend/src/components/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import { signUp, checkEmail } from '../services/authServices';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [emailAvailable, setEmailAvailable] = useState(null);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      handleEmailValidation(e.target.value);
    }
  };

  const handleEmailValidation = async (email) => {
    try {
      const { message } = await checkEmail(email);
      setEmailAvailable(message === 'Email available');
    } catch (err) {
      // console.error(err);
      if (err.response && err.response.status === 400) {
        setEmailAvailable(false);
      } else {
        setEmailAvailable(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await signUp(formData);
      localStorage.setItem('jwt', token);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Display the error message
      }
      //console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <br/><br/>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {emailAvailable === null ? null : emailAvailable ? (
                  <CheckIcon color="success" />
                ) : (
                  <WarningIcon color="error" />
                )}
              </InputAdornment>
            ),
          }}
          required
        />
        {emailAvailable === false && (
          <Typography variant="caption" color="error">
            Email already exists
          </Typography>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </form>
    </Container>
  );
};

export default SignUp;