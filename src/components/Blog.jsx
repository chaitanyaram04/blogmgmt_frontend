import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

const Blog = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const decodedId = atob(id);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [commentsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [commentUserLiked, setCommentUserLiked] = useState({});
  const [commentLikeId, setCommentLikeId] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${apiUrl}/blogs/${decodedId}`);
        console.log(response.data);
        setBlog(response.data);
        setUserLiked(response.data.user_liked); 
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blog');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [decodedId, apiUrl]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.post(`${apiUrl}/comments/all`, {
           blog_id: decodedId, offset: 0, limit: commentsPerPage 
        });
        console.log(response.data);
        setComments(response.data);
        setVisibleComments(response.data);
        const userLikedMap = {};
        const likeIdMap = {};
        response.data.forEach(comment => {
          userLikedMap[comment.id] = comment.user_liked;
          likeIdMap[comment.id] = comment.like_id;
        });
        setCommentUserLiked(userLikedMap);
        setCommentLikeId(likeIdMap);
      } catch (err) {
        setError('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [decodedId, commentsPerPage, apiUrl]);

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, [isLoggedIn]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      setError('You must be logged in to like the blog');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      let response;
      if (userLiked) {
        console.log(likeId);
        response = await axios.post(`${apiUrl}/likes/${likeId}`, {blog_id :decodedId}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog({ ...blog, likes_count: blog.likes_count - 1 });
      } else {
        response = await axios.post(`${apiUrl}/likes`, { blog_id: decodedId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlog({ ...blog, likes_count: blog.likes_count + 1 });
        console.log(response.data);
        setLikeId(response.data.like_id);
      }
      setUserLiked(!userLiked);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors); 
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isLoggedIn) {
      setError('You must be logged in to like the comment');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      let response;
      if (commentUserLiked[commentId]) {
        console.log("Hello from like comment");
        response = await axios.post(`${apiUrl}/likes/${commentLikeId[commentId]}`, { comment_id: commentId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setVisibleComments(comments.map((c) =>
          c.id === commentId ? { ...c, likes: response.data.likes, user_liked: false } : c
        ));
        setCommentUserLiked({ ...commentUserLiked, [commentId]: false });
      } else {
        console.log("Else");
        response = await axios.post(`${apiUrl}/likes`, { comment_id: commentId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setVisibleComments(comments.map((c) =>
          c.id === commentId ? { ...c, likes: response.data.likes, user_liked: true, like_id: response.data.like_id } : c
        ));
        setCommentUserLiked({ ...commentUserLiked, [commentId]: true });
        setCommentLikeId({ ...commentLikeId, [commentId]: response.data.like_id });
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/comments`, { content: comment, blog_id: decodedId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComments([response.data, ...comments]);
      setVisibleComments([response.data, ...visibleComments].slice(0, (page + 1) * commentsPerPage));
      setComment('');
      blog.comments_count += 1;
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors.join(', ')); 
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/comments/${editingComment.id}`, { content: editingContent }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.map((comment) => (comment.id === editingComment.id ? response.data : comment)));
      setVisibleComments(comments.map((comment) => (comment.id === editingComment.id ? response.data : comment)).slice(0, (page + 1) * commentsPerPage));
      setEditingComment(null);
      setEditingContent('');
    } catch (err) {
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/comments/${commentId}`, {blog_id  : decodedId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
      setVisibleComments(comments.filter((comment) => comment.id !== commentId).slice(0, (page + 1) * commentsPerPage));
      blog.comments_count -= 1;
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleEdit = () => {
    const encodedId = btoa(decodedId); 
    navigate(`/editblog/${encodedId}`, { state: { blog } });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${apiUrl}/blogs/${decodedId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete blog');
      }
    }
  };

  const loadMoreComments = async () => {
    const nextPage = page + 1;
    const offset = nextPage * commentsPerPage;
    
    try {
      const response = await axios.post(`${apiUrl}/comments/all`, {
        blog_id: decodedId, limit: offset, offset: commentsPerPage 
      });
      console.log(response.data);
      setVisibleComments([...visibleComments, ...response.data]);
      setPage(nextPage);
    } catch (err) {
      setError('Failed to load more comments');
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
  const handleLikeWithNoLogin = () => {
    navigate('/signin');
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
       
          <Box>
          {isLoggedIn && (user.role === 'admin' || user.id === blog.user_id) && (
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>)}
            {isLoggedIn && !blog.is_deleted && (user.role === 'admin' || user.id === blog.user_id) && (
            <IconButton onClick={handleDelete} sx={{ color: 'red' }}>
              <DeleteIcon />
            </IconButton>
            )}
          </Box>
        
      </Box>
      <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
        {blog.description}
      </Typography>
      {blog.status !== 'drafted' &&
        <>
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            {isLoggedIn ? (
              <IconButton onClick={handleLike} color={userLiked ? 'primary' : 'default'}>
                <ThumbUpIcon /> <Box component="span" sx={{ ml: 1 }}>{blog.likes_count}</Box>
              </IconButton>
            ) : (
              <Box display="flex" alignItems="center">
                 <IconButton onClick={handleLikeWithNoLogin}>
                <ThumbUpIcon fontSize="small" /> <Box component="span" sx={{ ml: 1 }}>{blog.likes_count}</Box>
                </IconButton>
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Comments ({blog.comments_count})
            </Typography>
            <List>
              {visibleComments.map((comment) => (
                <ListItem key={comment.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                      <ListItemText
                        primary={comment.content}
                        secondary={`by ${comment.user_name}`}
                      />
                    </Grid>
                    <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
                      <Box display="flex" alignItems="center">
                        {isLoggedIn ? (
                          <IconButton onClick={() => handleLikeComment(comment.id)} color={commentUserLiked[comment.id] ? 'primary' : 'default'}>
                            <ThumbUpIcon /> <Box component="span" sx={{ ml: 1 }}>{comment.likes}</Box>
                          </IconButton>
                        ) : (
                          <Box display="flex" alignItems="center">
                             <IconButton onClick={handleLikeWithNoLogin}>
                            <ThumbUpIcon fontSize="small" /> <Box component="span" sx={{ ml: 1 }}>{comment.likes}</Box>
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      {user && user.id === comment.user_id && (
                        <IconButton onClick={() => handleEditComment(comment)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      {user && (user.id === comment.user_id || user.id === blog.user_id) && (
                        <IconButton onClick={() => handleDeleteComment(comment.id)} sx={{ color: 'red' }}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
            {visibleComments.length < blog.comments_count && (
              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={loadMoreComments}>
                  Read More
                </Button>
              </Box>
            )}
            {isLoggedIn && !blog.is_deleted && !editingComment && (
              <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  required
                />
                <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ ml: 2 }}>
                  Submit
                </Button>
              </Box>
            )}
            {editingComment && (
              <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Edit comment"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  variant="outlined"
                />
                <Button variant="contained" color="success" onClick={handleUpdateComment} sx={{ ml: 2 }}>
                  Update
                </Button>
                <Button variant="contained" color="warning" onClick={() => setEditingComment(null)} sx={{ ml: 2 }}>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </>
      }
    </Container>
  );
};

export default Blog;