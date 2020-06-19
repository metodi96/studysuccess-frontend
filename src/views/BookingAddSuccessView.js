import React, {useState, useEffect} from 'react'
import axios from 'axios'

function BookingAddSuccessView(props) {

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get(`http://localhost:5000/bookings/success${props.location.search}`, {
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
                    console.log(err);
                })
        }
    }, [token, props.history, props.location.search]);
    return (
        <div>   
            {loading ? `Loading success page...`: `Successful payment. Redirecting to current bookings view.` }
        </div>
    )
}

export default BookingAddSuccessView
