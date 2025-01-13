import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    try {
      await axios.post(
        'http://127.0.0.1:3000/blogs',
        { blog: { title, description: content, status } }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(`Blog ${status === 'drafted' ? 'saved as draft' : 'published'} successfully`);
      setError('');
      setTitle('');
      setContent('');
      alert(`Blog ${status === 'drafted' ? 'saved as draft' : 'published'} successfully`);
      navigate('/'); 
    } catch (error) {
      setError('Error submitting blog');
      setSuccess('');
      alert('Error submitting blog');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Add a New Blog
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form>
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
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                onClick={(e) => handleSubmit(e, 'drafted')}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={(e) => handleSubmit(e, 'published')}
              >
                Publish
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewBlog;