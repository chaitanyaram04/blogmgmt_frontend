import React from 'react';
import BlogList from '../components/BlogList';

const Draft = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  return <BlogList url={`${apiUrl}/myblogs/draft`} title="Drafted blogs" />;
};

export default Draft;