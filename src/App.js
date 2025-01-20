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
import UserBlog from './pages/UserBlog';
import Comments from './pages/Comments';
import './App.css';
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myblogs/drafts" element={<Draft />} />
            <Route path="/myblogs/archive" element={<Archive />} />
            <Route path="/myblogs" element={<MyBlogs />} />
            <Route path="/newblog" element={<NewBlog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/editblog/:id" element={<EditBlog />} />
            <Route path="/user/:id/blogs" element = {<UserBlog />} />
            <Route path="/mycomments" element={<Comments />} />
          </Routes>
        </div>
        <div className='login'>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
              </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
