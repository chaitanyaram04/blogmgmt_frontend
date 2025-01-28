import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

function NoPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 5 }}>
      <Box>
        <Typography variant="h3" color="error" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" paragraph>
          The page you are looking for does not exist.
        </Typography>
        <Typography variant="body1" paragraph>
          You will be redirected to the home page in 5 seconds...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ marginTop: 2 }}
        >
          Go to Home Now
        </Button>
      </Box>
    </Container>
  );
}

export default NoPage;
