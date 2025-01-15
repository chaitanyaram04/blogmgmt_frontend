import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import BlogItem from './BlogItem';

const BlogList = ({ url, title}) => {

  const [blogs, setBlogs] = useState([]);
  const [noblog, setNoBlog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let sortedBlogs = response.data;
        console.log(sortedBlogs);
        if (sortByDate) {
          sortedBlogs = sortedBlogs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        }
        setBlogs(sortedBlogs);
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
  }, [url,sortByDate]);

  const handleSortChange = (event) => {
    setSortByDate(event.target.checked);
  };
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
      <Grid item xs>
        <Box display="flex" justifyContent="flex-end">
          <FormControlLabel
            control={<Checkbox checked={sortByDate} onChange={handleSortChange} />}
            label="Sort by Date"
          />
        </Box>
      </Grid>
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