import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Button, AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Divider, List, Typography, Box } from "@material-ui/core";
import logo from '../images/logo.png';
import UserService from '../services/UserService';

const useStylesNavBar = makeStyles((theme) => ({
    avatar: {
        display: "block",
        margin: "0.5rem auto",
        width: theme.spacing(13),
        height: theme.spacing(13)
    },
}));

function NavBar() {
    const classes = useStylesNavBar();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    // avatar is not showing the pic
    return (        
        <div>
            <Box component="nav" style={{ maxHeight: '50px', position: 'relative' }}>
                <AppBar position="fixed" style={{ background: "#E3E9ED" }}>
                    <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute', marginTop: '10px', marginLeft: '10px' }} />
                    <Toolbar style={{ marginLeft: '25px' }}>
                        <Button>
                            <Link to="/" className="nav-link">Homepage</Link>
                        </Button>
                        <Button>
                            <Link to="/bookings/current" className="nav-link">My Bookings</Link>
                        </Button>
                        <Button >
                            Booking Requests
                </Button>


                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Box>
                                    {
                                        console.log(UserService.getCurrentUser().userImage)
                                    }
                                    {
                                        UserService.isAuthenticated() ? <img src={`http://localhost:5000/${UserService.getCurrentUser().userImage}`} alt="Avatar" /> : <Avatar src={logo} alt="Avatar" />
                                    }
                                
                                </Box>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Manage my profile</MenuItem>
                                <MenuItem onClick={handleClose}>Log Out</MenuItem>
                            </Menu>
                        </div>

                    </Toolbar>
                </AppBar>
            </Box>

        </div>
    )
}

export default NavBar

//axios.get(`http://localhost:5000/${UserService.getCurrentUser().userImage}`)