import React from 'react';
import { Card, CardContent, Typography, Box, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <Card sx={{ height: '100%' }}>
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