import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CardActions, Button, Chip } from '@mui/material';

const BlogItem = ({ blog }) => {
  const navigate = useNavigate();
  const maxDescriptionLength = 100;

  const handleReadMore = () => {
    const encodedId = btoa(blog.id); 
    navigate(`/blog/${encodedId}`);
  };

  const encodeBlogId = (id) => {
    return btoa(id); 
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      {blog.status === 'drafted' && (
        <Chip
          label="Draft"
          color="error"
          sx={{
            position: 'absolute',
            marginTop: 10,
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            color="primary"
            onClick={() => navigate(`/user/${encodeBlogId(blog.user_id)}/blogs`)}
            sx={{ cursor: 'pointer', display: 'inline' }}
          >
            {blog.user_name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {
            blog.status !== 'drafted'
              ? `Published on: ${new Date(blog.updated_at).toLocaleDateString()}`
              : `Created on: ${new Date(blog.created_at).toLocaleDateString()}`
          }
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {blog.description.length > maxDescriptionLength
            ? `${blog.description.substring(0, maxDescriptionLength)}...`
            : blog.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleReadMore}>
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

export default BlogItem;