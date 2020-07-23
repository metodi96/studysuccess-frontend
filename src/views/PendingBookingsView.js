import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import axios from 'axios';
import PendingBooking from '../components/PendingBooking';
import { makeStyles, Box, InputLabel, Select, MenuItem } from '@material-ui/core';
import confused from '../images/confused-cat.png';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
    },
    booking: {
        marginLeft: '70px',
        marginRight: '50px',
        display: 'inline-block',
        marginBottom: '50px',
        marginTop: '20px',
        minWidth: '400px',
    }
}));

function PendingBookingsView(props) {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [sortMethodBookings, setSortMethodBookings] = useState(1);
    const classesBooking = useStylesBooking();

    useEffect(() => {
        let isMounted = true;
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null && UserService.isAuthenticated()) {
            console.log(token)
            axios
                .get('http://localhost:5000/bookings/pending', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        console.log(res.data);
                        if (res.data.length > 0) {
                            setInvitations(res.data.filter(invitation => {
                                const date = new Date(invitation.booking.timeslotStart);
                                return date >= new Date()
                            }).sort((bookingA, bookingB) => bookingB.booking.createdAt.localeCompare(bookingA.booking.createdAt)));
                        }
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
        if (event.target.value === 1) {
            setInvitations(invitations.sort((bookingA, bookingB) => bookingB.booking.createdAt.localeCompare(bookingA.booking.createdAt)));
        }
        else if (event.target.value === 2) {
            setInvitations(invitations.sort((bookingA, bookingB) => bookingA.booking.createdAt.localeCompare(bookingB.booking.createdAt)));
        }
        else if (event.target.value === 3) {
            setInvitations(invitations.sort((bookingA, bookingB) => bookingB.booking.timeslotEnd.localeCompare(bookingA.booking.timeslotEnd)))
        }
        else if (event.target.value === 4) {
            setInvitations(invitations.sort((bookingA, bookingB) => bookingA.booking.createdAt.localeCompare(bookingB.booking.timeslotEnd)))
        }
    }

    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (!loading) {
        if (invitations.length > 0) {
            return (
                <div>
                    <div style={{ display: 'flex', marginTop: '60px' }}>
                        <h3 className={classesBooking.heading}>You have {invitations.length} invitations to participate in tutorials.</h3>
                    </div>
                    <div className={classesBooking.container}>
                        <Box style={{ paddingRight: '2em', paddingTop: '2em', float: 'right' }}>
                            <InputLabel id="sort-by-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by"
                                value={sortMethodBookings}
                                onChange={handleChangeSortBookings}
                                classes={props.classesSort}
                            >
                                <MenuItem value={1}>{"Newest created"}</MenuItem>
                                <MenuItem value={2}>{"Oldest created"}</MenuItem>
                                <MenuItem value={3}>{"Date and time"}<ArrowDownwardIcon /></MenuItem>
                                <MenuItem value={4}>{"Date and time"}<ArrowUpwardIcon /></MenuItem>
                            </Select>
                        </Box>
                        <div style={{ paddingTop: '8.5%' }}>
                            {invitations.map((invitation) => (<div key={invitation._id} className={classesBooking.booking}><PendingBooking history={props.history} invitation={invitation} /></div>))}
                        </div>
                    </div>

                </div>
            )
        } else {
            return (
                <div style={{ fontSize: '1.35rem', textAlign: 'center', height: '56vh' }}>
                    <div>
                        <span>You currently don't have any pending invitations.</span>
                    </div>
                    <img width='150px' height='150px' alt='confused' src={confused} />
                </div>
            )
        }
    } else {
        return (
            <div>
                <p>Loading pending invitations...</p>
            </div>
        )
    }
}

export default PendingBookingsView
