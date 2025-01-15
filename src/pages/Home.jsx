import React from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogList from '../components/BlogList';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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