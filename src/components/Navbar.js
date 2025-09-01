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
        navigate({ pathname: '/SignIn' }, { replace: true });
    }

    const CLIENT_ID = '4KyHuzDgtD3gRt69egQDlBzTF9i4JQWq2O7ByTJl';
    const authURL = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${CLIENT_ID}&response_type=code&scope=ldap`;

    const handleSSO = () => {
        window.location.href = authURL;
    }

    const clearQueryAndNavigate = (path) => {
        const hash = `#${path}`;
        window.location.href = `${window.location.origin}${window.location.pathname}${hash}`;
    };


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
                        <ListItem
                            key={index}
                            disablePadding
                            component={Link}
                            to={{ pathname: text.path }}
                            className="drawer-item"
                        >
                            <ListItemText primary={text.text} slotProps={{ component: 'div' }} />
                        </ListItem>
                    ))}

                    {isAuthenticated && (
                        <ListItem
                            disablePadding
                            component={Link}
                            to={{ pathname: "/MyCourses" }}
                            className="drawer-item"
                        >
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
                            <Link to="/" className="navbar-button">Home</Link>
                            <Link to="/Schools" className="navbar-button">Courses</Link>
                            <Link to="/FAQ" className="navbar-button">FAQ</Link>
                            <Link to="/Contact" className="navbar-button">Contact Us</Link>
                            <Link to="/Certificates" className="navbar-button">Certificates</Link>
                            {isAuthenticated&&(<Link to="/MyCourses" className="navbar-button">My Courses</Link>)}
                        </Box>

                        {(<Button onClick={() => handleSSO()} className='navbar-login'>SSO</Button>)}
                        {!isAuthenticated && (<Button onClick={() => handleLoginClick()} className='navbar-login'>Sign In</Button>)}
                        {isAuthenticated && (<Button onClick={() => handleLogout()} className='navbar-login'>Logout</Button>)}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
