import React from 'react';
import BlogList from '../components/BlogList';

const Draft = () => {
  return <BlogList url="http://127.0.0.1:3000/myblogs/draft" title="Drafted blogs" />;
};

export default Draft;