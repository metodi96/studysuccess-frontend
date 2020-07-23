import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrentBookingOwn from '../components/CurrentBookingOwn';
import CurrentBookingAccepted from '../components/CurrentBookingAccepted';
import CurrentBookingNotPaid from '../components/CurrentBookingNotPaid';
import { makeStyles, Box, InputLabel, Select, MenuItem } from '@material-ui/core';
import confused from '../images/confused-cat.png';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Search from '../components/Search';

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '13%',
        marginRight: '17%',
        minWidth: '75%',
        marginBottom: '30px',
        display: 'block',
        textAlign: 'center'
    },
    heading: {
        marginLeft: '13%',
        marginTop: '50px',
    },
    headingSecondary: {
        marginLeft: '13%',
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

function CurrentBookingsView({ classesSort }) {
    const [bookings, setBookings] = useState([]);
    const [acceptedInvitations, setAcceptedInvitations] = useState([]);
    const [bookingsNotPaid, setBookingsNotPaid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSecond, setLoadingSecond] = useState(true);
    const [loadingThird, setLoadingThird] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [sortMethodBookings, setSortMethodBookings] = useState(1);
    const [sortMethodInvitations, setSortMethodInvitations] = useState(1);
    const [sortMethodPending, setSortMethodPending] = useState(1);
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
                        setBookings(res.data.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
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
                        setAcceptedInvitations(acceptedInvitationsWithoutBookingsNull.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
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
                        setBookingsNotPaid(res.data.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
                        setLoadingThird(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    //createdAt desc, createdAt asc, timeslotEnd desc, timeslotEnd asc
    const handleChangeSortBookings = (event) => {
        setSortMethodBookings(event.target.value);
        console.log(sortMethodBookings)
        if (event.target.value === 1) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
        }
        else if (event.target.value === 2) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.createdAt)));
        }
        else if (event.target.value === 3) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingB.timeslotEnd.localeCompare(bookingA.timeslotEnd)))
        }
        else if (event.target.value === 4) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.timeslotEnd)))
        }
    }

    const handleChangeSortInvitations = (event) => {
        setSortMethodInvitations(event.target.value)
        if (event.target.value === 1) {
            setAcceptedInvitations(acceptedInvitations.sort((bookingA, bookingB) => bookingB.booking.createdAt.localeCompare(bookingA.booking.createdAt)));
        }
        else if (event.target.value === 2) {
            setAcceptedInvitations(acceptedInvitations.sort((bookingA, bookingB) => bookingA.booking.createdAt.localeCompare(bookingB.booking.createdAt)));
        }
        else if (event.target.value === 3) {
            setAcceptedInvitations(acceptedInvitations.sort((bookingA, bookingB) => bookingB.booking.timeslotEnd.localeCompare(bookingA.booking.timeslotEnd)))
        }
        else if (event.target.value === 4) {
            setAcceptedInvitations(acceptedInvitations.sort((bookingA, bookingB) => bookingA.booking.timeslotEnd.localeCompare(bookingB.booking.timeslotEnd)))
        }
    }

    const handleChangeSortPending = (event) => {
        setSortMethodPending(event.target.value)
        if (event.target.value === 1) {
            setBookingsNotPaid(bookingsNotPaid.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
        }
        else if (event.target.value === 2) {
            setBookingsNotPaid(bookingsNotPaid.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.createdAt)));
        }
        else if (event.target.value === 3) {
            setBookingsNotPaid(bookingsNotPaid.sort((bookingA, bookingB) => bookingB.timeslotEnd.localeCompare(bookingA.timeslotEnd)))
        }
        else if (event.target.value === 4) {
            setBookingsNotPaid(bookingsNotPaid.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.timeslotEnd)))
        }
    }

    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (!loading && !loadingSecond && !loadingThird) {
        if (bookings.length > 0 || acceptedInvitations.length > 0 || bookingsNotPaid.length > 0) {
            return (
                <div>
                    <h3 className={classesBooking.heading}>You have {bookings.length + acceptedInvitations.length} scheduled lessons in total.</h3>
                    {
                        bookings.length > 0 ?
                        <div>
                            <div style={{ display: 'flex' }}>
                                <h4 className={classesBooking.headingSecondary}>Out of these {bookings.length} {bookings.length === 1 ? 'is' : 'are'} your own. You are free to either invite friends to a booking or cancel it entirely.</h4>
                            </div>
                            <div className={classesBooking.container}>
                                <Box style={{ paddingRight: '2em', paddingTop: '2em', float: 'right' }}>
                                    <InputLabel id="sort-by-label">Sort by</InputLabel>
                                    <Select
                                        labelId="sort-by-label"
                                        id="sort-by"
                                        value={sortMethodBookings}
                                        onChange={handleChangeSortBookings}
                                        classes={classesSort}
                                    >
                                        <MenuItem value={1}>{"Newest created"}</MenuItem>
                                        <MenuItem value={2}>{"Oldest created"}</MenuItem>
                                        <MenuItem value={3}>{"Date and time"}<ArrowDownwardIcon /></MenuItem>
                                        <MenuItem value={4}>{"Date and time"}<ArrowUpwardIcon /></MenuItem>
                                    </Select>
                                </Box>
                                <div style={{ paddingTop: '8.5%' }}>
                                    {bookings.map((booking) => (<div key={booking._id} className={classesBooking.booking}><CurrentBookingOwn booking={booking} /></div>))}
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        acceptedInvitations.length > 0 ?
                        <div>
                            <div style={{ display: 'flex' }}>
                                <h4 className={classesBooking.headingSecondary}>You have {acceptedInvitations.length} accepted invitation{acceptedInvitations.length === 1 ? '' : 's'} to bookings created by friends. You cannot invite friends or cancel the lesson.</h4>
                            </div>
                            <div className={classesBooking.container}>
                                <Box style={{ paddingRight: '2em', paddingTop: '2em', float: 'right' }}>
                                    <InputLabel id="sort-by-label">Sort by</InputLabel>
                                    <Select
                                        labelId="sort-by-label"
                                        id="sort-by"
                                        value={sortMethodInvitations}
                                        onChange={handleChangeSortInvitations}
                                        classes={classesSort}
                                    >
                                        <MenuItem value={1}>{"Newest created"}</MenuItem>
                                        <MenuItem value={2}>{"Oldest created"}</MenuItem>
                                        <MenuItem value={3}>{"Date and time"}<ArrowDownwardIcon /></MenuItem>
                                        <MenuItem value={4}>{"Date and time"}<ArrowUpwardIcon /></MenuItem>
                                    </Select>
                                </Box>
                                <div style={{ paddingTop: '8.5%' }}>
                                    {acceptedInvitations.map((invitation) => (<div key={invitation._id} className={classesBooking.booking}><CurrentBookingAccepted invitation={invitation} /></div>))}
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        bookingsNotPaid.length > 0 ?
                        <div>
                            <div style={{ display: 'flex' }}>
                                <h4 className={classesBooking.headingSecondary}>You have {bookingsNotPaid.length} booking(s) which have not yet been paid or await approval from your tutor.</h4>
                            </div>
                            <div className={classesBooking.container}>
                                <Box style={{ paddingRight: '2em', paddingTop: '2em', float: 'right' }}>
                                    <InputLabel id="sort-by-label">Sort by</InputLabel>
                                    <Select
                                        labelId="sort-by-label"
                                        id="sort-by"
                                        value={sortMethodPending}
                                        onChange={handleChangeSortPending}
                                        classes={classesSort}
                                    >
                                        <MenuItem value={1}>{"Newest created"}</MenuItem>
                                        <MenuItem value={2}>{"Oldest created"}</MenuItem>
                                        <MenuItem value={3}>{"Date and time"}<ArrowDownwardIcon /></MenuItem>
                                        <MenuItem value={4}>{"Date and time"}<ArrowUpwardIcon /></MenuItem>
                                    </Select>
                                </Box>
                                <div style={{ paddingTop: '8.5%' }}>
                                    {bookingsNotPaid.map((booking) => (<div key={booking._id} className={classesBooking.booking}><CurrentBookingNotPaid booking={booking} token={token} /></div>))}
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            )
        } else {
            return (
                <div style={{ fontSize: '1.35rem', textAlign: 'center', marginTop: '50px' }}>
                    <div>
                        <span>You currently don't have any bookings.</span>
                    </div>
                    <img width='150px' height='150px' alt='confused' src={confused} />
                    <div style={{ marginTop: '25px' }}>
                        <span>Search for a subject with which you struggle and we'll find tutors for you.</span>
                    </div>
                    <div style={{ textAlign: '-webkit-center', marginTop: '10px', display: 'inline-block', marginBottom: '76px' }}><Search /></div>
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
}

export default CurrentBookingsView
