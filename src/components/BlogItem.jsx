import React from 'react';
import { Card, CardContent, Typography, Box, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BlogItem = ({ blog }) => {
  const navigate = useNavigate();
  const maxDescriptionLength = 100;

  const handleReadMore = () => {
    navigate(`/blog/${blog.id}`);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            by {blog.user_name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" >
          {new Date(blog.updated_at).toLocaleDateString()}
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