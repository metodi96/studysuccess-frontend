import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import CurrentBooking from '../components/CurrentBooking'
import styles from './currentBookingsStyles.module.css'

function CurrentBookingsView(props) {
    const [bookings, setBookings] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get('http://localhost:5000/bookings/current', {
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
                        <h3 className={styles.heading}>You have {bookings.length} scheduled lessons.</h3>
                        <div className={styles.container}>
                        {
                            <p>Hello {UserService.getCurrentUser().email}!
                            Your first booking is tutored by: {bookings[0].tutor.firstname}</p>
                        }
                        { bookings.map((booking) => <CurrentBooking key={booking._id} booking={booking} />) }
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        {console.log(UserService.getCurrentUser())}
                        <p>You currently don't have any bookings.</p>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <p>Loading bookings...</p>
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

export default CurrentBookingsView
