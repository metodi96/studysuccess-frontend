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

const useStylesContainer = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(255, 209, 0, 0)',
        marginTop: '25px',
        paddingBottom: '25px',
        width: '100%',
        marginLeft: '59%'
    },
    text: {
        color: 'slategrey',
        textAlign: 'center'
    },
    homepagebox: {
        marginTop: "5%",
        textAlign: 'center',
    },
    headTutors: {
        color: 'lightslategrey',
        textAlign: 'center',
        marginTop: '-10px',
        marginBottom: '-14px'
    },
    special: {
        color: 'lightslategrey',
        textAlign: 'center'
    }
}));


const useStylesTutor = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        padding: '2em',
        width: '90%',
        height: '25%',
        marginLeft: '3%',
        marginRight: '5%',
        marginTop: '5%',
        borderRadius: '4px'
    },
    content: {
        backgroundColor: 'white',
        padding: '0.5em',
        alignSelf: 'center'
    },
    grid: {
        flexGrow: '1'
    },
    rating: {
        display: 'flex'
    },
    test: {
        fontW: 'bold'
    },
    heading: {
        color: 'goldenrod',
        marginTop: '1px'
    }
}))

function MainView(props) {
    const classesTutor = useStylesTutor();
    const classesBox = useStylesContainer();

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', justifyContent: 'center' }}>
                {UserService.isAuthenticated() ?
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            <div className={classesBox.homepagebox}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <Avatar src={logo} alt="StudySuccess" style={{ display: 'flex' }} />
                                            <h1 className={classesBox.text} style={{ marginBottom: '0%', marginTop: '0%' }}>StudySuccess</h1>
                                        </div>
                                        <h4 className={classesBox.text} style={{ marginTop: '0%', marginBottom: '0%' }}>Come to improve your studies.</h4>
                                        <h4 className={classesBox.text} style={{ marginTop: '0%' }}>Stay because you enjoy the success.</h4>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "2%" }}>
                                <Search></Search>
                            </div>
                        </div>
                    </div>
                    :
                    <div style={{ display: 'inline-block', justifyContent: 'center' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ position: 'absolute', left: '2%', display: 'flex' }}>
                                <Avatar src={logo} alt="StudySuccess" />
                                <div>
                                    <Search></Search>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: '2%', display: 'flex' }}>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to={'/auth/login'}>Login</Button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30%' }}>
                            <div>
                                <div className={classesBox.homepagebox}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex' }}>
                                                <Avatar src={logo} alt="StudySuccess" style={{ display: 'flex' }} />
                                                <h1 className={classesBox.text} style={{ marginBottom: '0%', marginTop: '0%' }}>StudySuccess</h1>
                                            </div>
                                            <h4 className={classesBox.text} style={{ marginTop: '0%', marginBottom: '0%' }}>Come to improve your studies.</h4>
                                            <h4 className={classesBox.text} style={{ marginTop: '0%' }}>Stay because you enjoy the success.</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                }

            </div>
            {
                !UserService.isAuthenticated() ?
                    <SignUp universities={props.universities}></SignUp>
                    :
                    <div className={classesTutor.container} >
                        <h2 className={classesBox.headTutors}>Our highest-rated tutors</h2>
                        <TrendingTutors classesTutor={classesTutor}></TrendingTutors>
                    </div>
            }
        </div>
    )
}


export default MainView
