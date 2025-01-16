import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Comments = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { isLoggedIn } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`${apiUrl}/comments/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments');
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchComments();
    }
  }, [isLoggedIn, apiUrl]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const encodeBlogId = (id) => {
    return btoa(id); 
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.content}
              secondary={
                comment.is_deleted ? (
                  <Alert severity="warning">This blog has been deleted</Alert>
                ) : (
                  <Link to={`/blog/${encodeBlogId(comment.blog_id)}`}>View Blog</Link>
                )
              }
              // secondary={
              //     comment.is_deleted ? (
              //       'This blog has been deleted'
              //     ) : (
              //       <Link to={`/blog/${comment.blog_id}`}>View Blog</Link>
              //     )
              //   }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Comments;


                        
                 