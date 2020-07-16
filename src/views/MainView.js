import Search from '../components/Search';
import SignUp from '../components/SignUp';
import TrendingTutors from '../components/TrendingTutors';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import React from 'react';

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

    return (
        <div>
            <div className={classes.root}>
                {UserService.isAuthenticated() ?
                    '' :
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
             <div className={classesTutor.container}>
                <h3 className={classesTutor.heading}>Tutors with highest rating</h3>
                <TrendingTutors classesTutor={classesTutor}></TrendingTutors>
            </div>
        </div>
    )
}


export default MainView
