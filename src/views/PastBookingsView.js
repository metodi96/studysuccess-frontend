import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import axios from 'axios';
import PastBooking from '../components/PastBooking';
import styles from './bookingsStyles.module.css';

function PastBookingsView(props) {
    const [bookings, setBookings] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get('http://localhost:5000/bookings/past', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [token]);
    const redirect = () => {
        props.history.push('/')
    }
    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (UserService.isAuthenticated()) {
        if (!loading) {
            if (bookings.length > 0) {
                return (
                    <div>
                        <h3 className={styles.heading}>You have completed {bookings.length} lessons.</h3>
                        <div className={styles.container}>
                        { bookings.map((booking) => (<div key={booking._id} className={styles.booking}><PastBooking booking={booking} /></div>)) }
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <p>You currently don't have any past bookings.</p>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <p>Loading past bookings...</p>
                </div>
            )
        }
    } else {
        return (
            <div>
                {
                    redirect()
                }
            </div>
        )
    }

}

export default PastBookingsView
