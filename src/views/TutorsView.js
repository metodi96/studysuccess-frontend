import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TutorsView() {
    const [tutors, setTutors] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:5000/tutors")
            .then(res => {
                setTutors(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    });
    return (
        <div>
            <p>Test</p>
            <ul>
                {tutors.map(tutor => <li key={tutor._id}>{tutor.firstname}</li>)}
            </ul>
        </div>
    )
}

export default TutorsView
