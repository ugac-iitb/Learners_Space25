import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';
import '../styles/Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CareerCellLgo from '../data/images/Career_Cell_logo.png'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import authSlice from '../store/authSlice';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    const linkList = [
        { text: 'Home', path: '/' },
        { text: 'Courses', path: '/Schools' },
        { text: 'FAQ', path: '/FAQ' },
        { text: 'Contact Us', path: '/Contact' },
    ]

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate('/');
    }

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate({ pathname: '/SignIn' }, { replace: true });
    }

    const isLinkActive = (path) => {
        const currentPath = location.pathname;
        if (path === '/') {
            return currentPath === '/';
        }
        if (path === '/Schools') {
            return currentPath.startsWith('/Schools') || currentPath.startsWith('/Course') || currentPath.startsWith('/TrackCourse');
        }
        if (path === '/MyCourses') {
            return currentPath.startsWith('/MyCourses');
        }
        return currentPath === path;
    };

    const isAuthActive = location.pathname === '/SignIn' || location.pathname === '/Signup';

    const drawerContent = (
        <Box
            sx={{
                width: 250,
                height: '100%',
                backgroundColor: "#1E1B2A",
                color: '#E5E2F2',
                paddingTop: '20px',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
                className="drawer-list"
                role="presentation"
            >
                <List>
                    {linkList.map((item, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            component={Link}
                            to={{ pathname: item.path }}
                            className={`drawer-item ${isLinkActive(item.path) ? 'active' : ''}`}
                        >
                            <ListItemText primary={item.text} slotProps={{ component: 'div' }} />
                        </ListItem>
                    ))}

                    {isAuthenticated && (
                        <ListItem disablePadding className="drawer-item navbar-profile-mobile">
                            <ListItemText primary={user?.full_name || user?.email || "Profile"} slotProps={{ component: 'div' }} />
                        </ListItem>
                    )}

                    {isAuthenticated && (
                        <ListItem
                            disablePadding
                            component={Link}
                            to={{ pathname: "/MyCourses" }}
                            className={`drawer-item ${isLinkActive('/MyCourses') ? 'active' : ''}`}
                        >
                            <ListItemText primary="My Courses" slotProps={{ component: 'div' }} />
                        </ListItem>
                    )}

                    {!isAuthenticated && (
                        <ListItem 
                            disablePadding 
                            onClick={handleLoginClick} 
                            className={`drawer-item ${isAuthActive ? 'active' : ''}`}
                        >
                            <ListItemText primary="Sign In" slotProps={{ component: 'div' }} />
                        </ListItem>
                    )}
                    {isAuthenticated && (
                        <ListItem disablePadding onClick={handleLogout} className="drawer-item">
                            <ListItemText primary="Logout" slotProps={{ component: 'div' }} />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );

    return (
        <AppBar position="static" className="navbar">
            <Toolbar className='navbar-toolbar' >
                <img src={CareerCellLgo} alt="Career Cell Logo" className='navbar-logo' />
                <Typography variant="h6" component="div" className="navbar-title">
                    Learners' Space
                </Typography>

                {isMobile ? (
                    <>
                        <Box sx={{ marginLeft: 'auto' }}>
                            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                                {drawerContent}
                            </Drawer>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box className="nv-buttons" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'right' }}>
                            <Link to="/" className={`navbar-button ${isLinkActive('/') ? 'active' : ''}`}>Home</Link>
                            <Link to="/Schools" className={`navbar-button ${isLinkActive('/Schools') ? 'active' : ''}`}>Courses</Link>
                            <Link to="/FAQ" className={`navbar-button ${isLinkActive('/FAQ') ? 'active' : ''}`}>FAQ</Link>
                            <Link to="/Contact" className={`navbar-button ${isLinkActive('/Contact') ? 'active' : ''}`}>Contact Us</Link>
                            {isAuthenticated&&(<Link to="/MyCourses" className={`navbar-button ${isLinkActive('/MyCourses') ? 'active' : ''}`}>My Courses</Link>)}
                        </Box>

                        {!isAuthenticated && (<Button onClick={() => handleLoginClick()} className={`navbar-login ${isAuthActive ? 'active' : ''}`}>Sign In</Button>)}
                        {isAuthenticated && (
                            <Typography className="navbar-profile">
                                {user?.full_name || user?.email || "Profile"}
                            </Typography>
                        )}
                        {isAuthenticated && (<Button onClick={() => handleLogout()} className='navbar-login'>Logout</Button>)}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
