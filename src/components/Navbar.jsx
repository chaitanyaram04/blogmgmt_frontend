import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
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
        window.location.href = ('/');

        handleMenuClose();
    };

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const currentPath = location.pathname;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                                >
                                    Drafts
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleNavigation('/myblogs/archive')}
                                    selected={currentPath === '/myblogs/archive'}
                                >
                                    Archive
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleNavigation('/myblogs')}
                                    selected={currentPath === '/myblogs'}
                                >
                                    My blogs
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    {currentPath !== '/' && (
                        <Button color="inherit" onClick={() => handleNavigation('/')}>Home</Button>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
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
