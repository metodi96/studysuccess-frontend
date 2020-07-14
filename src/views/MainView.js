import Search from '../components/Search';
import SignUp from '../components/SignUp';
import TrendingTutors from '../components/TrendingTutors';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import logo from '../images/logo.png';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const useStylesTutor = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        padding: '1em'
    },
    content: {
        backgroundColor: 'white',
        padding: '0.5em'
    },
    grid: {
        flexGrow: '1'
    },
    rating: {
        display: 'flex'
    },
    test: {
        fontW: 'bold'
    }
}))

function MainView(props) {
    const classes = useStyles();
    const classesTutor = useStylesTutor();

    const logout = () => {
        console.log('Attempting logout...')
        UserService.logout();
        if (props.location.pathname !== '/') {
            props.history.push('/');
        }
        else {
            window.location.reload();
        }
        UserService.isAuthenticated() ? console.log('User is still authenticated') : console.log('User logged out successfully');
    }

    return (
        <div>
            <div className={classes.root}>
                {UserService.isAuthenticated() ?
                    <div>
                        <p>Welcome {UserService.getCurrentUser().email}!</p>
                        <Button
                            variant="outlined"
                            component={Link}
                            onClick={logout}
                            to={'/logout'}>Logout</Button>
                    </div> :
                    <Button
                        variant="outlined"
                        component={Link}
                        to={'/auth/login'}>Login</Button>
                }
            </div>
            <Search></Search>
            {
                !UserService.isAuthenticated() ?
                    <SignUp universities={props.universities}></SignUp>
                    : null
            }
            <div>
                <h3 className={classesTutor.heading}>Tutors with highest rating</h3>
                <TrendingTutors profile={props.profile} classesTutor={classesTutor}></TrendingTutors>
            </div>
        </div>
    )
}


export default MainView
