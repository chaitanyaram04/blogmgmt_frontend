import React from 'react';
import BlogList from '../components/BlogList';

const Archive = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  return <BlogList url={`${apiUrl}/myblogs/archive`} title="Archived blogs" />;
};

export default Archive;