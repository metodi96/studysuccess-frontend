import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import axios from 'axios';
import PastBooking from '../components/PastBooking'
import { makeStyles } from '@material-ui/core';

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: '1100px',
        marginBottom: '30px',
        textAlign: 'center'
    },
    heading:  {
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

function PastBookingsView(props) {
    const [bookings, setBookings] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesBooking = useStylesBooking();
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
                        <h3 className={classesBooking.heading}>You completed {bookings.length} lessons.</h3>
                        <div className={classesBooking.container}>
                        { bookings.map((booking) => (<div key={booking._id} className={classesBooking.booking}><PastBooking booking={booking} /></div>)) }
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
