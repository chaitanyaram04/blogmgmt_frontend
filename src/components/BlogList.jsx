import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Alert,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import BlogItem from './BlogItem';

const BlogList = ({ url, title }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBlogs(response.data);
        setFilteredBlogs(response.data); 
        setLoading(false);
      } catch (err) {
        setError('There was an error fetching the blogs.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [url]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      const filtered = blogs.filter((blog) => {
        const blogDate = new Date(blog.updated_at);
        return blogDate.toLocaleDateString() === date.toLocaleDateString();
      });
      setDate(date.toLocaleDateString());
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs); 
    }
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
      <Grid container alignItems="center" spacing={2}>
        {/* Title and Date Picker on the same line */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box display="flex" justifyContent="flex-end">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        {filteredBlogs.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No blogs found for the {date}
            </Typography>
          </Grid>
        ) : (
          filteredBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <BlogItem blog={blog} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default BlogList;
