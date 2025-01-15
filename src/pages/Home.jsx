import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogList from '../components/BlogList';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { name } = useAuth();
  const [userName, setUsername] = useState('');

  useEffect(() => {
    if (isLoggedIn === true) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUsername(user.user_name);
    }
  }, [isLoggedIn]);

  const handleClick = () => {
    navigate('/newblog');
  };

 
  const apiUrl = process.env.REACT_APP_API_URL;

  return (
    <Container>
      {isLoggedIn && (
        <>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 4, ml: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{ textTransform: 'none', fontSize: '16px', padding: '10px 20px' }}
              >
                Add Blog
              </Button>
            </Grid>
          </Grid>
        </>
      )}
      <BlogList url={`${apiUrl}/blogs`} title="All blogs" />
    </Container>
  );
};

export default Home;