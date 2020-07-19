import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrendingTutor from './TrendingTutor';

function TrendingTutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        axios.get('http://localhost:5000/tutors/')
            .then(res => {
                if (isMounted) {
                    console.log(res.data);
                    setTutors(res.data.filter(tutor => tutor.subjectsToTeach !== undefined && tutor.subjectsToTeach.length > 0 && tutor.avgRating !== undefined).sort((a, b) => { return b.avgRating - a.avgRating })
                        .slice(0, 4));
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
            })
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [])

    if (!loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {tutors.map(tutor => (
                    <TrendingTutor key={tutor._id} tutor={tutor} />
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
