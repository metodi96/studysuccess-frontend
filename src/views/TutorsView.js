import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TutorsView({ match }) {
    const [tutors, setTutors] = useState([]);
    useEffect(() => {
        axios
            .get(`http://localhost:5000/tutors/${match.params.subjectId}`)
            .then(res => {
                setTutors(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    });
    return (
        <div>
            <ul>
    {tutors.map(tutor => <li key={tutor._id}>{tutor.firstname} {tutor.lastname}</li>)}
            </ul>
        </div>
    )
}

export default TutorsView
