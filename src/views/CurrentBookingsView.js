import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import CurrentBookingOwn from '../components/CurrentBookingOwn';
import CurrentBookingAccepted from '../components/CurrentBookingAccepted';
import styles from './bookingsStyles.module.css';

function CurrentBookingsView(props) {
    const [bookings, setBookings] = useState([]);
    const [acceptedInvitations, setAcceptedInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
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

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get('http://localhost:5000/bookings/current/accepted', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setAcceptedInvitations(res.data);
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
            if (bookings.length > 0 || acceptedInvitations.length > 0) {
                return (
                    <div>
                        <h3 className={styles.heading}>You have {bookings.length + acceptedInvitations.length} scheduled lessons.</h3>
                        <div className={styles.container}>
                            {bookings.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)).map((booking) => (<div key={booking._id} className={styles.booking}><CurrentBookingOwn booking={booking} /></div>))}
                        </div>
                        <div className={styles.container}>
                            {acceptedInvitations.sort((invitationA, invitationB) => invitationB.createdAt.localeCompare(invitationA.createdAt)).map((invitation) => (<div key={invitation._id} className={styles.booking}><CurrentBookingAccepted invitation={invitation} /></div>))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
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
