import React, { useState, useEffect } from 'react';
import PersonalInfo from '../components/PersonalInfo';
import ProfileSubjects from '../components/ProfileSubjects';
import ProfileTutorSubjects from '../components/ProfileTutorSubjects';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import FavouriteTutorsList from '../components/FavouriteTutorsList';

const useStylesProfile = makeStyles(() => ({
    container: {
        backgroundColor: 'white',
        marginLeft: '30px',
        marginBottom: '30px',
        marginTop: '25px',
        paddingLeft: '25px',
        paddingTop: '50px',
        paddingBottom: '25px',
        maxWidth: '350px',
        minWidth: '350px',
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

const useStylesBox = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.3)',
        margin: 'auto',
        paddingLeft: '25px',
        paddingTop: '25px',
        paddingBottom: '25px',
        width: '1270px',
        borderRadius: '4px'
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
            fontSize: '14px',
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

const useStylesFavourites = makeStyles(() => ({
    container: {
        margin: '20px 40px 40px 20px',
    }
}));

function ManageProfileView(props) {

    const [profile, setProfile] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [loading, setLoading] = useState(true);
    const classesProfile = useStylesProfile();
    const classesField = useStylesField();
    const classesSelect = useStylesSelect();
    const classesButton = useStylesButton();
    const classesBox = useStylesBox();
    const classesFavourites = useStylesFavourites();

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
                        console.log(res.data);
                        setProfile(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    return (
        !loading ?
            <div>
                <div className={classesBox.container} style={{ display: 'flex' }}>
                    <PersonalInfo classesProfile={classesProfile} classesSelect={classesSelect} classesButton={classesButton}
                        classesField={classesField} profile={profile} studyPrograms={props.studyPrograms} universities={props.universities} />
                    <ProfileSubjects classesField={classesField} classesSelect={classesSelect} classesButton={classesButton}
                        classesProfile={classesProfile} profile={profile} />
                    <ProfileTutorSubjects classesField={classesField} classesSelect={classesSelect}
                        classesProfile={classesProfile} profile={profile} />
                </div>
                <div className={classesFavourites.container}>
                    <FavouriteTutorsList profile={profile} />
                </div>
            </div> : <div>Loading profile...</div>

    )
}

export default ManageProfileView
