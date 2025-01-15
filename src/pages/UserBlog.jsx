import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Container, Alert, Typography, Grid } from '@mui/material';
import BlogItem from '../components/BlogItem'; 

const UserBlog = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [blogs, setBlogs] = useState([]);
    const [noblog, setNoBlog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const decodedId = atob(id);
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${apiUrl}/blogs/user/${decodedId}`, {
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
    }, [id]);
  
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

export default UserBlog;