import React from 'react';
import Search from '../components/Search';
import SignUp from '../components/SignUp';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function MainView(props) {
    const classes = useStyles();

    const logout = () => {
        console.log('Attempting logout...')
        UserService.logout();
        if(props.location.pathname !== '/') {
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
            <SignUp></SignUp>
        </div>
    )
}

export default MainView
