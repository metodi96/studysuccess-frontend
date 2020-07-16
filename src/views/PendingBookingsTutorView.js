import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import PendingBookingTutor from '../components/PendingBookingTutor';
import { makeStyles } from '@material-ui/core';

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: '1100px',
        marginBottom: '30px',
    },
    heading: {
        marginLeft: '200px',
        marginTop: '60px',
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

function PendingBookingsTutorView(props) {
    const [bookingsPending, setBookingsPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesBooking = useStylesBooking();

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null  && UserService.isAuthenticated()) {
            console.log(token)
            axios
                .get('http://localhost:5000/bookings/pendingTutor', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setBookingsPending(res.data);
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
            if (bookingsPending.length > 0) {
                return (
                    <div>
                        <h3 className={classesBooking.heading}>You have {bookingsPending.length} invitations with suggested timeslots from students.</h3>
                        <div className={classesBooking.container}>
                            {bookingsPending.sort((bookingPendingA, bookingPendingB) => bookingPendingB.createdAt.localeCompare(bookingPendingA.createdAt)).map((bookingPending) => (<div key={bookingPending._id} className={classesBooking.booking}><PendingBookingTutor history={props.history} bookingPending={bookingPending} /></div>))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <p>You currently don't have any pending invitations.</p>
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

export default PendingBookingsTutorView
