import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const drawerContent = (
        <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                {['Home', 'Courses', 'FAQ', 'Contact Us','Login'].map((text) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="static" className="navbar">
            <Toolbar className='navbar-toolbar'>
                <IconButton size="large" edge="start" color="inherit" aria-label="logo">
                    <CatchingPokemonIcon />
                </IconButton>
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
                        </Box>
                        <Button className='navbar-login'>Sign In</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
