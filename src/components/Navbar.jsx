import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';


export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    console.log(searchQuery);
    const apiUrl = process.env.REACT_APP_API_URL;
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [username, setUsername] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    const handleSearchChange = async (event, newValue) => {
        setSearchQuery(newValue);
        const token = localStorage.getItem('token');
        if (newValue) {
            try {
                const response = await axios.post(`${apiUrl}/blogs/search`, 
                   { blog: { query: newValue } }, 
                   {
                    headers: { Authorization: `Bearer ${token}` } 
                });
    
              
                setSearchSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
            }
        } else {
            setSearchSuggestions([]);
        }
    };

    const encodeBlogId = (id) => {
        return btoa(id); 
      };
   

    
    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Good morning';
        if (hours < 18) return 'Good afternoon';
        return 'Good evening';
    };

    useEffect(() => {
        if (isLoggedIn === true) {
            const user = JSON.parse(localStorage.getItem('user'));
            setUsername(`, ${user.user_name}`);
        }
    }, [isLoggedIn]);

    const location = useLocation();
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        handleMenuClose();
    };

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const currentPath = location.pathname;

    return (
        <Box sx={{ flexGrow: 1 }} position="sticky">
            <AppBar position="sticky">
                <Toolbar>
                    {isLoggedIn && (
                        <>
                           
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                            >
                                <MenuIcon />
                            </IconButton>

                        
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem
                                    onClick={() => handleNavigation('/myblogs/drafts')}
                                    selected={currentPath === '/myblogs/drafts'}
                                    sx={{ fontSize: '1.5rem' }} 
                                >
                                    Drafts
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleNavigation('/myblogs/archive')}
                                    selected={currentPath === '/myblogs/archive'}
                                    sx={{ fontSize: '1.5rem' }} 
                                >
                                    Archive
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleNavigation('/myblogs')}
                                    selected={currentPath === '/myblogs'}
                                    sx={{ fontSize: '1.5rem' }} 
                                >
                                    My blogs
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleNavigation('/mycomments')}
                                    selected={currentPath === '/mycomments'}
                                    sx={{ fontSize: '1.5rem' }} 
                                >
                                    My Comments
                                </MenuItem>
                            </Menu>
                           
                        </>
                    )}

                  
                    {currentPath !== '/' && (
                        <Button color="inherit" onClick={() => handleNavigation('/')}>Home</Button>
                    )}
                    
                    {currentPath !== '/' ?(
                    <Button color="inherit" sx={{ marginLeft: 49,fontSize: '1.5rem'  }} >
                                {`${getGreeting()}${username}`}
                            </Button>):(
                                 <Button color="inherit" sx={{ marginLeft: 16, fontSize: '1.5rem' }} >
                                 {`${getGreeting()}${username}`}
                             </Button>
                            )
}
                    <Box sx={{ flexGrow: 1 }} />
                    <Autocomplete
                                freeSolo
                                options={searchSuggestions}
                                getOptionLabel={(option) => option.title || ''}
                                onInputChange={handleSearchChange}
                                onChange={(event, value) => {
                                    if (value && value.id) {
                                         window.location.href = `/blog/${encodeBlogId(value.id)}`;
                                    }
                                }}
                            
                                renderInput={(params) => (
                                    <TextField
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        {...params}
                                        variant="outlined"
                                        placeholder="Search blogs..."
                                        size="small"
                                        sx={{ marginLeft: 1, width: 300 }}
                                    />
                                )}
                                sx={{ marginRight: 2 }}
                            />
                    
                        <IconButton 
                            color="inherit"
                            aria-label="search"
                        
                        >
                            <SearchIcon sx={{ marginRight:1 }} />
                        </IconButton>

                    {isLoggedIn ? (
                        <Button color="inherit" onClick={handleSignOut}>Signout</Button>
                    ) : (
                        <>
                            {currentPath !== '/signup' && (
                                <Button color="inherit" onClick={() => handleNavigation('/signup')}>Signup</Button>
                            )}
                            {currentPath !== '/signin' && (
                                <Button color="inherit" onClick={() => handleNavigation('/signin')}>Signin</Button>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
