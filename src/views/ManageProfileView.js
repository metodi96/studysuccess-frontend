import React, {useState, useEffect} from 'react';
import PersonalInfo from '../components/PersonalInfo';
import axios from 'axios';


function ManageProfileView(props) {

    const [profile, setProfile] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

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
        <PersonalInfo profile={profile} studyPrograms={props.studyPrograms} universities={props.universities} /> : <div>Loading profile...</div>
    )
}

export default ManageProfileView
