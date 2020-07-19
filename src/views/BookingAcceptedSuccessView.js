import React, { useState, useEffect } from 'react'
import axios from 'axios';

function BookingAcceptedSuccessView(props) {

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    useEffect(() => {
        let isMounted = true;
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            // to be added behind /success
            axios
                .get(`http://localhost:5000/bookings/successAccepted${props.location.search}`, {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        console.log(res.data);
                        setLoading(false);
                        console.log(props.location.search);
                        props.history.push('/bookings/current')
                    }
                })
                .catch(err => {
                    console.log('Something went wrong')
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, props.history, props.location.search]);
    return (
        <div style={{ fontSize: '1.25rem', textAlign: 'center', marginTop: '100px' }}>            
            {loading ? `Loading success page...` : `Successful payment for accepted booking. Redirecting to current bookings view.`}
        </div>
    )
}

export default BookingAcceptedSuccessView
