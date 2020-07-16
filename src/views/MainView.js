import Search from '../components/Search';
import SignUp from '../components/SignUp';
import TrendingTutors from '../components/TrendingTutors';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import UserService from '../services/UserService';
import React from 'react';
import { Avatar } from '@material-ui/core';
import logo from '../images/logo.png';

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




            <div style={{textAlign: 'center', position: 'relative' }}>
                {UserService.isAuthenticated() ?
                    <div style={{ display: 'flex' }}>
                        <div >
                            <div style={{ marginTop: "5%", textAlign: 'center' }}>
                                <h2>StudySuccess</h2>
                                <p>Come to improve your studies.</p>
                                <p>Stay because you enjoy the success.</p>
                            </div>
                            <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute' }} />
                            <div style={{ marginTop: "16%", marginLeft: "30%" }}>
                                <Search></Search>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div style={{ display: 'flex' }}>
                            <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute' }} />
                            <div style={{ marginLeft: "3%" }}>
                                <Search></Search>
                            </div>
                            <div style={{ marginTop: "5%" }}>
                                <h2>StudySuccess</h2>
                                <p>Come to improve your studies.</p>
                                <p>Stay because you enjoy the success.</p>
                            </div>
                            <div style={{ position: 'absolute', right: '2%', display: 'flex' }}>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to={'/auth/login'}>Login</Button>
                            </div>
                        </div>
                    </div>

                }

            </div>
            {
                !UserService.isAuthenticated() ?
                    <SignUp universities={props.universities}></SignUp>
                    : <div>
                        <h3 className={classesTutor.heading}>Tutors with highest rating</h3>
                        <TrendingTutors classesTutor={classesTutor}></TrendingTutors>
                    </div>
            }

        </div>
    )
}


export default MainView
