import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Blog from './components/Blog';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Signin from './pages/Signin';
import Draft from './pages/Draft';
import Archive from './pages/Archive';
import MyBlogs from './pages/MyBlogs';
import NewBlog from './pages/NewBlog';
import EditBlog from './pages/EditBlog';
const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/myblogs/drafts" element={<Draft />} />
        <Route path="/myblogs/archive" element={<Archive />} />
        <Route path="/myblogs" element={<MyBlogs />} />
        <Route path="/newblog" element={<NewBlog />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/editblog/:id" element={<EditBlog />} />

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
