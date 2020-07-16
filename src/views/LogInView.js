import React from 'react';
import LogIn from '../components/LogIn';
import { Avatar } from '@material-ui/core';
import logo from '../images/logo.png';
import { makeStyles } from '@material-ui/core/styles';

const useStylesContainer = makeStyles(() => ({
    text: {
        color: 'slategrey',
        textAlign: 'center'
    },
    homepagebox: {
        marginTop: "5%",
        textAlign: 'center',
        marginLeft: '530px'
    },
    login: {
        textAlign: 'center', 
        height: '39vh', 
        marginTop: '100px',
        marginLeft: '550px'
    }
}));

function LogInView(props) {
    const classesBox = useStylesContainer();

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <div className={classesBox.homepagebox}>
                    <h1 className={classesBox.text}>StudySuccess</h1>
                    <h4 className={classesBox.text} style={{ marginTop: '-12px' }}>Come to improve your studies.</h4>
                    <h4 className={classesBox.text} style={{ marginTop: '-20px' }}>Stay because you enjoy the success.</h4>
                </div>
                <Avatar src={logo} alt="StudySuccess" style={{ position: 'absolute', marginLeft: '648px', marginTop: '-130px' }} />
                <div className={classesBox.login}>
                    <LogIn {...props} />
                </div>
            </div>
        </div>

    )
}

export default LogInView
