import React, { useState, useEffect } from 'react'
import axios from 'axios';

function BookingAcceptedSuccessView(props) {

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            // to be added behind /success
            axios
                .get(`http://localhost:5000/bookings/successAccepted${props.location.search}`, {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setLoading(false);
                    props.history.push('/bookings/current')
                })
                .catch(err => {
                    console.log('Something went wrong')
                    console.log(err);
                })
        }
    }, [token, props.history, props.location.search]);
    return (
        <div style={{ fontSize: '1.25rem', textAlign: 'center', marginTop: '100px' }}>            
            {loading ? `Loading success page...` : `Successful payment for accepted booking. Redirecting to current bookings view.`}
        </div>
    )
}

export default BookingAcceptedSuccessView
