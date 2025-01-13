import React from 'react';
import BlogList from '../components/BlogList';

const Archive = () => {
  return <BlogList url="http://127.0.0.1:3000/myblogs/archive" title="Archived blogs" />;
};

export default Archive;