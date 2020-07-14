import React, { useState, useEffect } from 'react';
import PersonalInfo from '../components/PersonalInfo';
import ProfileSubjects from '../components/ProfileSubjects';
import ProfileTutorSubjects from '../components/ProfileTutorSubjects';
import axios from 'axios';
import { makeStyles, CircularProgress } from '@material-ui/core';

const useStylesProfile = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '100px',
        marginBottom: '30px',
        marginTop: '25px',
        paddingLeft: '25px',
        paddingTop: '25px',
        paddingBottom: '25px',
        maxWidth: '350px',
        minWidth: '350px'
    }
}));

const useStylesField = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
        },
        '& input:hover': {
            backgroundColor: 'white !important',
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px',
        marginLeft: '33px'
    }
}));

const useStylesSelect = makeStyles(() => ({
    root: {
        '& .MuiSelect-select.MuiSelect-select': {
            backgroundColor: 'white !important',
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px',
        marginLeft: '33px'
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        marginTop: '15px',
        marginLeft: '33px'
    }
}));

function ManageProfileView(props) {

    const [profile, setProfile] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesProfile = useStylesProfile();
    const classesField = useStylesField();
    const classesSelect = useStylesSelect();
    const classesButton = useStylesButton();

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
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    return (
        profile !== undefined ?
            <div style={{ display: 'flex' }}>
                <PersonalInfo classesProfile={classesProfile} classesSelect={classesSelect} classesButton={classesButton}
                    classesField={classesField} profile={profile} studyPrograms={props.studyPrograms} universities={props.universities} />
                <ProfileSubjects classesField={classesField} classesSelect={classesSelect} classesButton={classesButton}
                    classesProfile={classesProfile} profile={profile} />
                <ProfileTutorSubjects classesField={classesField} classesSelect={classesSelect}
                    classesProfile={classesProfile} profile={profile} />
            </div> : <div>Loading profile...</div>

    )
}

export default ManageProfileView
