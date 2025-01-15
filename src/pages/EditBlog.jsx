import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const decodedId = atob(id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [publish, setPublish] = useState(false);
  const [error, setError] = useState('');
  const [is_deleted, setDelete] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${apiUrl}/blogs/${decodedId}`);
        const blog = response.data;
        console.log(response.data);
        setTitle(blog.title);
        setDescription(blog.description);
        setStatus(blog.status);
        setDelete(blog.is_deleted);
        console.log(is_deleted);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog');
        setLoading(false);
      }
    };

    if (location.state && location.state.blog) {
      const { blog } = location.state;
      setTitle(blog.title);
      setDescription(blog.description);
      setStatus(blog.status);
      setDelete(blog.is_deleted);
      setLoading(false);
    } else {
      fetchBlog();
    }
  }, [decodedId
    , location.state, apiUrl, is_deleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedBlog = { title, description };
    if (publish) {
      updatedBlog.status = 'published';
      updatedBlog.is_deleted = 'false';
    }
    try {
      await axios.post(
        `${apiUrl}/blogs/${decodedId
        }`,
        { blog: updatedBlog },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Blog updated successfully');
      setError('');
      navigate(`/blog/${id}`);
    } catch (error) {
      setError('Error updating blog');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Edit Blog
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            {(status === 'drafted' || is_deleted)&& (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    color="primary"
                  />
                }
                label="Publish"
              />
            )}
            <Button
              type="submit"
              fullWidth
              th
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Update Blog
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditBlog;