import React from 'react';
import Search from '../components/Search';
//import { makeStyles } from '@material-ui/core/styles';
import {Button, Avatar} from '@material-ui/core/';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import SignUp from '../components/SignUp';
import logo from '../images/logo.png';
/*
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
}));

const useStylesBlock = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
    }
}));

const useStylesHeading = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex'
    }
}));    */

function MainView(props) {
// const classes = useStyles();
   // const classesBlock = useStylesBlock();
   // const classesHeading = useStylesHeading();

    return (
        <div>
            <div>
                {UserService.isAuthenticated() ?
                    <div>
                        <p>Welcome {UserService.getCurrentUser().email}!</p>
                    </div> :
                    null
                }
            </div>
            <div style={{fontFamily: 'Verdana, Courier, serif', textAlign: 'center'}}>
            {UserService.isAuthenticated() ?
                <div style={{marginTop: '60px', position: 'relative'}}>     
                    <div style={{ position: 'absolute', left: '38%' }}>                                    
                    <Avatar src={logo} alt="StudySuccess"/>
                    </div>
                    <h2>StudySuccess</h2>               
                    <p>Come to improve your studies.</p>
                    <p>Stay because you enjoy the success.</p>
                    <div style={{left: '50%'}}>
                    <Search></Search>
                    </div>
                </div>
                :
                <div> 
                    <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute'}}/>
                    <h2>StudySuccess</h2>
                    <p>Come to improve your studies.</p>
                    <p>Stay because you enjoy the success.</p>
                    <Search></Search>
                </div>
            }
                {!UserService.isAuthenticated() ?
                    <div style={{ position: 'absolute', right: '2%' }}>
                        <Button
                            variant="outlined"
                            component={Link}
                            to={'/auth/login'}>Login</Button>
                    </div>
                    :
                    null
                }
            </div>
            {
                !UserService.isAuthenticated() ?
                    <SignUp></SignUp>
                    : null
            }
        </div>
    )
}

export default MainView
