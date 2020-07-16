import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import CurrentBookingOwn from '../components/CurrentBookingOwn';
import CurrentBookingAccepted from '../components/CurrentBookingAccepted';
import CurrentBookingNotPaid from '../components/CurrentBookingNotPaid';
import { makeStyles } from '@material-ui/core';
import confused from '../images/confused-cat.png'
import Search from '../components/Search';

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: '1100px',
        marginBottom: '30px',
        borderRadius: '4px',
        textAlign: 'center'
    },
    heading: {
        marginLeft: '200px',
        marginTop: '50px',
    },
    headingSecondary: {
        marginLeft: '200px',
        marginTop: '10px',
    },
    booking: {
        marginLeft: '100px',
        marginRight: '50px',
        display: 'inline-block',
        marginBottom: '50px',
        marginTop: '20px',
        minWidth: '400px',
    }
}));

function CurrentBookingsView(props) {
    const [bookings, setBookings] = useState([]);
    const [acceptedInvitations, setAcceptedInvitations] = useState([]);
    const [bookingsNotPaid, setBookingsNotPaid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSecond, setLoadingSecond] = useState(true);
    const [loadingThird, setLoadingThird] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesBooking = useStylesBooking();
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
                        setLoadingSecond(false);
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
                        setLoadingThird(false);
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
        if (!loading && !loadingSecond && !loadingThird) {
            if (bookings.length > 0 || acceptedInvitations.length > 0 || bookingsNotPaid.length > 0) {
                return (
                    <div>
                        <h3 className={classesBooking.heading}>You have {bookings.length + acceptedInvitations.length} scheduled lessons in total.</h3>
                        {
                            bookings.length > 0 ?
                                <h4 className={classesBooking.headingSecondary}>Out of these {bookings.length} {bookings.length === 1 ? 'is' : 'are'} your own. You are free to either invite friends to a booking or cancel it entirely.</h4>
                                : null
                        }
                        <div className={classesBooking.container}>
                            {bookings.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)).map((booking) => (<div key={booking._id} className={classesBooking.booking}><CurrentBookingOwn booking={booking} /></div>))}
                        </div>
                        {
                            acceptedInvitations.length > 0 ?
                                <h4 className={classesBooking.headingSecondary}>You have {acceptedInvitations.length} accepted invitation{acceptedInvitations.length === 1 ? '' : 's'} to bookings created by friends. You cannot invite friends or cancel the lesson.</h4>
                                : null
                        }

                        <div className={classesBooking.container}>
                            {acceptedInvitations.sort((invitationA, invitationB) => invitationB.createdAt.localeCompare(invitationA.createdAt)).map((invitation) => (<div key={invitation._id} className={classesBooking.booking}><CurrentBookingAccepted invitation={invitation} /></div>))}
                        </div>
                        {
                            bookingsNotPaid.length > 0 ?
                                <h4 className={classesBooking.headingSecondary}>You have {bookingsNotPaid.length} booking(s) which have not yet been paid or await approval from your tutor.</h4>
                                : null
                        }
                        <div className={classesBooking.container}>
                            {bookingsNotPaid.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)).map((booking) => (<div key={booking._id} className={classesBooking.booking}><CurrentBookingNotPaid booking={booking} token={token} /></div>))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{ fontSize: '1.35rem', textAlign: 'center', marginTop: '50px' }}>
                        <div>
                            <span>You currently don't have any bookings.</span>
                        </div>
                        <img width='200px' height='200px' src={confused} />
                        <div style={{ marginTop: '25px' }}>
                            <span>Search for a subject with which you struggle and we'll find tutors for you.</span>
                        </div>
                        <div style={{ textAlign: '-webkit-center', marginTop: '10px' }}><Search /></div>
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
