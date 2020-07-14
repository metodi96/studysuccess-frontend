import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrendingTutor from './TrendingTutor';

function TrendingTutors({profile}) {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/tutors/')
            .then(res => {
                console.log(res.data);
                setTutors(res.data.sort((a, b) => { return a.avgRating - b.avgRating })
                    .slice(0, 4));
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    if(!loading) {
        return (
            <div style={{display: 'flex'}}>
                {tutors.map(tutor => (
                    <TrendingTutor profile={profile} key={tutor._id} tutor={tutor} />
                ))}
            </div>
    )
    } else {
        return (
            <div>Trending tutors loading...</div>
        )
    }
    

}

export default TrendingTutors
