import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import CurrentBookingOwn from '../components/CurrentBookingOwn';
import CurrentBookingAccepted from '../components/CurrentBookingAccepted';
import CurrentBookingNotPaid from '../components/CurrentBookingNotPaid';
import styles from './bookingsStyles.module.css';
import Navbar from '../components/Navbar';

function CurrentBookingsView(props) {
    const [bookings, setBookings] = useState([]);
    const [acceptedInvitations, setAcceptedInvitations] = useState([]);
    const [bookingsNotPaid, setBookingsNotPaid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
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
                    if (isMounted) {
                        console.log(res.data);
                        setBookings(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setLoading(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get('http://localhost:5000/bookings/current/accepted', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        console.log(res.data);
                        let acceptedInvitationsAll = res.data;
                        let acceptedInvitationsWithoutBookingsNull = [];
                        acceptedInvitationsAll.forEach(element => {
                            if (element.booking !== null) {
                                acceptedInvitationsWithoutBookingsNull.push(element);
                            }
                        });
                        console.log(acceptedInvitationsWithoutBookingsNull);
                        setAcceptedInvitations(acceptedInvitationsWithoutBookingsNull);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setLoading(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get('http://localhost:5000/bookings/current/notAccepted', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        console.log(res.data);
                        setBookingsNotPaid(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    const redirect = () => {
        props.history.push('/')
    }
    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (UserService.isAuthenticated()) {
        if (!loading) {
            if (bookings.length > 0 || acceptedInvitations.length > 0 || bookingsNotPaid.length > 0) {
                return (
                    <div>
                        <Navbar />
                        <h3 className={styles.heading}>You have {bookings.length + acceptedInvitations.length} scheduled lessons in total.</h3>
                        <div className={styles.container}>
                            {bookings.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)).map((booking) => (<div key={booking._id} className={styles.booking}><CurrentBookingOwn booking={booking} /></div>))}
                        </div>
                        <div className={styles.container}>
                            {acceptedInvitations.sort((invitationA, invitationB) => invitationB.createdAt.localeCompare(invitationA.createdAt)).map((invitation) => (<div key={invitation._id} className={styles.booking}><CurrentBookingAccepted invitation={invitation} /></div>))}
                        </div>
                        <h3 className={styles.heading}>You have {bookingsNotPaid.length} booking(s) which have not yet been paid or await approval from your tutor.</h3>
                        <div className={styles.container}>
                            {bookingsNotPaid.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)).map((booking) => (<div key={booking._id} className={styles.booking}><CurrentBookingNotPaid booking={booking} token={token} /></div>))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Navbar />
                        <p>You currently don't have any bookings.</p>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <Navbar />
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
