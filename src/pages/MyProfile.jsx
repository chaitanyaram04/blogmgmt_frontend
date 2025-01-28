import React, { useState, useEffect } from 'react';
import { TextField, Button, Alert, Container, Grid, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyProfile = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [id,setId] = useState('');
  useEffect(() => {
    const response = JSON.parse(localStorage.getItem('user'));
    const email = response.email
    const userName = response.user_name
    setId(response.id);
        setFormData({
          user_name: userName,
          email: email,
          password: '',
          password_confirmation: '',
      
    });

  
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (formData.password !== formData.password_confirmation) {
      tempErrors.password_confirmation = 'Password and confirmation do not match.';
    }

    if (!formData.user_name) {
      tempErrors.user_name = 'User name is required.';
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required.';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid.';
    }

    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await axios.post(`${apiUrl}/myprofile/${id}`, {user:formData});
        setSuccessMessage('User updated successfully');
        setAlertMessage('');
        alert("User successfully updated")
        navigate('/');
      } catch (error) {
        setAlertMessage('Something went wrong. User not updated.');
        setSuccessMessage('');
      }
    }
  };

  return (
    <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
          Edit Profile
          </Typography>

      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              error={!!errors.user_name}
              helperText={errors.user_name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Update User
            </Button>
          </Grid>
        </Grid>
      </form>
      </Paper>
      </Box>
    </Container>
  );
};

export default MyProfile;
