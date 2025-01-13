import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import BlogItem from './BlogItem';

const BlogList = ({ url, title }) => {
  const [blogs, setBlogs] = useState([]);
  const [noblog, setNoBlog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNoBlog(true);
          setLoading(false);
        } else {
          setError('There was an error fetching the drafts.');
          setLoading(false);
        }
      }
    };
    fetchBlogs();
  }, [url]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {noblog ? `No ${title} found` : title}
      </Typography>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <BlogItem blog={blog} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogList;