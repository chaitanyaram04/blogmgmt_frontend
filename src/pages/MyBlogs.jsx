import React from 'react';
import BlogList from '../components/BlogList';

const MyBlogs = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  return <BlogList url={`${apiUrl}/myblogs`} title="Published blogs" />;
};

export default MyBlogs;