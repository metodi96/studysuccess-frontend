import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Button, AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Box } from "@material-ui/core";
import logo from '../images/logo.png';
import axios from 'axios';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import UserService from '../services/UserService';
import { useLocation, useHistory } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';

const useStylesNavBarButtons = makeStyles(() => ({
    root: {
        color: 'black',
        fontFamily: '"Titillium Web", sans-serif'
    }
}))

const useStylesAvatar = makeStyles(() => ({
    root: {
        marginLeft: '7px'
    }
}))

const useStylesAvatarNoPic = makeStyles(() => ({
    root: {
        marginLeft: '15px'
    }
}));

const useStylesBadge = makeStyles(() => ({
    badge: {
        top: '20%',
        right: '-7%'
    }
}));

function Navbar() {
    const classesNavBarButtons = useStylesNavBarButtons();
    const classesAvatar = useStylesAvatar();
    const classesAvatarNoPic = useStylesAvatarNoPic();
    const classesBadge = useStylesBadge();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElBookings, setAnchorElBookings] = useState(null);
    const [profile, setProfile] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [loading, setLoading] = useState(true);
    const [pendingNumber, setPendingNumber] = useState(0);
    const [pendingNumberTutor, setPendingNumberTutor] = useState(0);
    const location = useLocation();
    const history = useHistory();
    const open = Boolean(anchorEl);
    const openBookings = Boolean(anchorElBookings);

    const logout = () => {
        console.log('Attempting logout...')
        console.log(location.pathname)
        UserService.logout();
        if (location.pathname !== '/') {
            history.push('/');
            window.location.reload();
        }
        else {
            window.location.reload();
        }
        UserService.isAuthenticated() ? console.log('User is still authenticated') : console.log('User logged out successfully');
    }

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        setProfile(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })

            axios
                .get('http://localhost:5000/bookings/pending', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        setPendingNumber(res.data.length);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            axios
                .get('http://localhost:5000/bookings/pendingTutor', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        setPendingNumberTutor(res.data.length);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenuBookings = (event) => {
        setAnchorElBookings(event.currentTarget);
    };

    const handleCloseBookings = () => {
        setAnchorElBookings(null);
    };

    return (
        !loading ?
            <div>
                <Box component="nav" style={{ maxHeight: '50px', position: 'relative' }}>
                    <AppBar position="fixed" style={{ background: "#E3E9ED" }}>
                        <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute', marginTop: '10px', marginLeft: '10px' }} />
                        <Toolbar style={{ marginLeft: '25px' }}>
                            <Button className={classesNavBarButtons.root} component={Link} to="/">Homepage</Button>
                            <div>
                                <Button
                                    className={classesNavBarButtons.root}
                                    onClick={handleMenuBookings}
                                >
                                    My Bookings
                            </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElBookings}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={openBookings}
                                    onClose={handleCloseBookings}
                                >
                                    <MenuItem onClick={handleCloseBookings} component={Link} to="/bookings/current">Scheduled Bookings</MenuItem>
                                    <MenuItem onClick={handleCloseBookings} component={Link} to="/bookings/past">Completed Bookings</MenuItem>
                                    <MenuItem onClick={handleCloseBookings} component={Link} to="/bookings/pending"><Badge classes={classesBadge} color="secondary" badgeContent={pendingNumber}>Pending Bookings</Badge></MenuItem>
                                    
                                </Menu>
                            </div>

                            {
                                profile !== undefined && profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt ?
                                    <Button component={Link} to="/bookings/pendingTutor" className={classesNavBarButtons.root} >
                                        <Badge classes={classesBadge} color="secondary" badgeContent={pendingNumberTutor}>Booking Requests</Badge>
                                    </Button> : null
                            }
                            


                            <div style={{ position: 'absolute', right: '2%' }}>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <Box>
                                        {
                                            !loading && profile !== undefined && UserService.isAuthenticated()
                                                ? <div style={{ display: 'flex' }}><span style={{
                                                    paddingTop: '10px',
                                                    color: 'black',
                                                    fontSize: 'initial',
                                                    fontFamily: '"Titillium Web", sans-serif'
                                                }}>{profile.firstname}</span><ArrowDropDownIcon style={{ color: 'black', paddingTop: '10px' }}></ArrowDropDownIcon>
                                                    <Avatar classes={profile.userImage ? classesAvatar : classesAvatarNoPic} src={`http://localhost:5000/${profile.userImage}`} alt="Avatar" />
                                                </div> : null
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
                                    <MenuItem onClick={handleClose} component={Link} to="/profile">Manage my profile</MenuItem>
                                    <MenuItem onClick={logout}>Log Out</MenuItem>
                                </Menu>
                            </div>

                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
            : <div></div>
    )
}

export default Navbar

//axios.get(`http://localhost:5000/${UserService.getCurrentUser().userImage}`)
/*
<div>
                        <Button className={classesNavBarButtons.root}>My Bookings</Button>
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
                                <MenuItem onClick={handleClose} component={Link} to="/bookings/current">Scheduled Bookings</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to="/bookings/past">Completed Bookings</MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to="/bookings/pending">Pending Bookings</MenuItem>
                            </Menu>
                        </div>
*/