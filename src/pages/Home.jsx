import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogList from '../components/BlogList';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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
            <Grid item>
              <Typography variant="h6">
                Welcome, {userName}!
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <BlogList url="http://127.0.0.1:3000/blogs" title="All blogs" />
    </Container>
  );
};

export default Home;