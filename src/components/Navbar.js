import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import CareerCellLgo from '../data/images/Career_Cell_logo.png'
import UGACLogo from '../data/images/ugac.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import authSlice from '../store/authSlice';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const linkList = [
        { text: 'Home', path: '/' },
        { text: 'Courses', path: '/Schools' },
        { text: 'FAQ', path: '/FAQ' },
        { text: 'Contact Us', path: '/Contact' }
    ]

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };


    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        console.log("User logged out");
    }


    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/SignIn');
    }

    const drawerContent = (
        <Box
            sx={{
                width: 250,
                height: '100%',
                backgroundColor: "#f2bc00",
                color: 'white',
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
                        {linkList.map((text, index) => (
                            <ListItem key={index} disablePadding component={Link} to={text.path} className="drawer-item">
                                <ListItemText primary={text.text} slotProps={{ component: 'div' }} />
                            </ListItem>
                        ))}

                        {isAuthenticated && (
                            <ListItem disablePadding component={Link} to="/MyCourses" className="drawer-item">
                                <ListItemText primary="My Courses" slotProps={{ component: 'div' }} />
                            </ListItem>
                        )}

                        {!isAuthenticated && (
                            <ListItem disablePadding onClick={handleLoginClick} className="drawer-item">
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
                {/* <IconButton edge="start" color="inherit" aria-label="logo"> */}
                    <img src={UGACLogo} alt="Career Cell Logo" className='ugac-logo' />
                    <img src={CareerCellLgo} alt="Career Cell Logo" className='navbar-logo' />
                {/* </IconButton> */}
                <Typography variant="h6" component="div" className="navbar-title">
                    Learners Space
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
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <Link to="/" className="navbar-button">Home</Link>
                            <Link to="/Schools" className="navbar-button">Courses</Link>
                            <Link to="/FAQ" className="navbar-button">FAQ</Link>
                            <Link to="/Contact" className="navbar-button">Contact Us</Link>
                            {isAuthenticated&&(<Link to="/MyCourses" className="navbar-button">My Courses</Link>)}
                        </Box>
                        {!isAuthenticated && (<Button onClick={() => handleLoginClick()} className='navbar-login'>Sign In</Button>)}
                        {isAuthenticated && (<Button onClick={() => handleLogout()} className='navbar-login'>Logout</Button>)}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
