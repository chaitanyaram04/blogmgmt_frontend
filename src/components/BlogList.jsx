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
  const [noblog, setNoBlog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    filterBlogs(fromDate, date);
  
  };
  const filterBlogs = (from, to) => {
    if (!from || !to) {
      setFilteredBlogs(blogs); 
      return;
    }
    else if(from.toLocaleDateString() > to.toLocaleDateString()){
      alert("Select correct from and to dates(fromDate can't be greater than toDate");
      setFromDate(null);
      setToDate(null);
    }else{
      const tod = to.toLocaleDateString();
      const fr = from.toLocaleDateString();
      const filtered = blogs.filter((blog) => {      
        const blogDate = new Date(blog.updated_at);
        const blogD = blogDate.toLocaleDateString();
        
        return fr <= blogD && blogD <= tod ;
      });

      setFilteredBlogs(filtered);
    }
  
  };
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setBlogs(response.data);
        setFilteredBlogs(response.data); 
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
       <Typography variant="h4" gutterBottom>
        {noblog ? `No ${title} found` : title}
      </Typography>
      {!noblog &&
      <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={handleFromDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleToDateChange}
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
            {
              fromDate && toDate ? (
                fromDate.toLocaleDateString() !== toDate.toLocaleDateString() ? (
                  title === "All blogs" ? (
                    `No Published blogs found between ${fromDate.toLocaleDateString()} and ${toDate.toLocaleDateString()}`
                  ) : (
                    `No ${title} found between ${fromDate.toLocaleDateString()} and ${toDate.toLocaleDateString()}`
                  )
                ) : (
                 
                  fromDate ? (
                    `No ${title} found on ${fromDate.toLocaleDateString()}`
                  ) : (
                    'No blogs found'
                  )
                )
              ) : (
                
                fromDate ? (
                  `No ${title} found on ${fromDate.toLocaleDateString()}`
                ) : (
                  'No blogs found'
                )
              )
            }
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
      </>
      }
    </Container>
  );
};

export default BlogList;
