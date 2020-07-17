import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PastBooking from '../components/PastBooking'
import { makeStyles, Box, InputLabel, Select, MenuItem } from '@material-ui/core';
import confused from '../images/confused-cat.png'
import Search from '../components/Search';

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: '1100px',
        marginBottom: '30px',
        textAlign: 'center'
    },
    heading: {
        marginLeft: '200px',
        minWidth: '925px'
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

function PastBookingsView(props) {
    const [bookings, setBookings] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesBooking = useStylesBooking();
    const [sortMethodBookings, setSortMethodBookings] = useState(1);
    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
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

    //createdAt desc, createdAt asc, timeslotEnd desc, timeslotEnd asc
    const handleChangeSortBookings = (event) => {
        setSortMethodBookings(event.target.value);
        console.log(sortMethodBookings)
        if (event.target.value == 1) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingB.createdAt.localeCompare(bookingA.createdAt)));
        }
        else if (event.target.value == 2) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.createdAt)));
        }
        else if (event.target.value == 3) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingB.timeslotEnd.localeCompare(bookingA.timeslotEnd)))
        }
        else if (event.target.value == 4) {
            setBookings(bookings.sort((bookingA, bookingB) => bookingA.createdAt.localeCompare(bookingB.timeslotEnd)))
        }
    }

    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (!loading) {
        if (bookings.length > 0) {
            return (
                <div>
                    <div style={{ display: 'flex', marginTop: '60px' }}>
                        <h3 className={classesBooking.heading}>You completed {bookings.length} lessons.</h3>
                        <Box>
                            <InputLabel id="sort-by-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by"
                                value={sortMethodBookings}
                                onChange={handleChangeSortBookings}
                            >
                                <MenuItem value={1}>{"Oldest created"}</MenuItem>
                                <MenuItem value={2}>{"Newest created"}</MenuItem>
                                <MenuItem value={3}>{"Last bookings"}</MenuItem>
                                <MenuItem value={4}>{"Next bookings"}</MenuItem>
                            </Select>
                        </Box>
                    </div>
                    <div className={classesBooking.container}>
                        {bookings.map((booking) => (<div key={booking._id} className={classesBooking.booking}><PastBooking booking={booking} /></div>))}
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ fontSize: '1.35rem', textAlign: 'center', marginTop: '50px' }}>
                    <div>
                        <span>You currently don't have any past bookings.</span>
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
                <p>Loading completed bookings...</p>
            </div>
        )
    }
}

export default PastBookingsView
