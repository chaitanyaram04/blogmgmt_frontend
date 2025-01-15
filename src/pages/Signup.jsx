import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';


axios.defaults.withCredentials = true;


const Signup = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setIsLoggedIn } = useAuth();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    'user_name': '',
    'email': '',
    'password': '',
    'role': 'user'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
     const response = await axios({
      method: 'post',
      url: `${apiUrl}/signup`,
      headers: { 'Content-Type': 'application/json',}, 
      data: formData
    });
    
      console.log('formData:', formData);
      // const response = await axios.post('http://localhost:3000/signup', formData, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });      
      const { token, user } = response.data;
     localStorage.setItem('token', token);
     localStorage.setItem('user', JSON.stringify(user));
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     setIsLoggedIn(true);
     navigate(-2);
   } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors.join(', ')); 
      } else {
        setError('An unexpected error occurred. Please try again later.');
      };
   }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => navigate('/signin')}
              fullWidth
              sx={{ mt: 2 }}
            >
              Login into existing account? Sign in
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;