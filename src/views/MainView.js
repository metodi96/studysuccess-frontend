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
        marginLeft: '-400px'
    },
    text: {
        color: 'slategrey',
        textAlign: 'center'
    },
    homepagebox: {
        marginTop: "5%",
        textAlign: 'center',
        marginLeft: '640px'
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
        width: '1300px',
        height: '350px',
        marginLeft:'70px',
        marginTop: '40px',
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
    heading:{
        color: 'goldenrod',
        marginTop: '1px'
    }
}))

function MainView(props) {
    const classesTutor = useStylesTutor();
    const classesBox = useStylesContainer();

    return (
        <div>
            <div style={{textAlign: 'center', position: 'relative' }}>
                {UserService.isAuthenticated() ?
                    <div style={{ display: 'flex' }}>
                        <div>
                            <div className={classesBox.homepagebox}>
                                <h1 className={classesBox.text}>StudySuccess</h1>
                                <h4 className={classesBox.text} style={{marginTop:'-12px'}}>Come to improve your studies.</h4>
                                <h4 className={classesBox.text} style={{marginTop:'-20px'}}>Stay because you enjoy the success.</h4>
                            </div>
                            <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute', marginLeft:'628px', marginTop:'-130px' }} />
                            <div style={{ marginTop: "2%", marginLeft: "58%" }}>
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
                            <div className={classesBox.container} style={{ marginTop: "5%", marginRight: '160px' }}>
                                <h1 className={classesBox.text}>StudySuccess</h1>
                                <h4 className={classesBox.special} style={{marginTop:'-14px'}}>Come to improve your studies.</h4>
                                <h4 className={classesBox.special} style={{marginTop:'-20px'}}>Stay because you enjoy the success.</h4>
                                <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute', marginLeft:'465px', marginTop:'-126px' }} />
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
