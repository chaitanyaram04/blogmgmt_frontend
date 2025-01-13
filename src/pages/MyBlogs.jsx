import React from 'react';
import BlogList from '../components/BlogList';

const MyBlogs = () => {
  return <BlogList url="http://127.0.0.1:3000/myblogs" title="Published blogs" />;
};

export default MyBlogs;