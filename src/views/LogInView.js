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
    },
    login: {
        textAlign: 'center',
        height: '45vh',
    }
}));

function LogInView(props) {
    const classesBox = useStylesContainer();

    return (
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
                <div className={classesBox.login}>
                    <LogIn {...props} />
                </div>
            </div>
        </div>

    )
}

export default LogInView
