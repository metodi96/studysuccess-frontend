import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';

function CurrentBookingsView(props) {
    const [bookings, setBookings] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get('http://localhost:5000/bookings/current', {
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem('jwtToken').slice(10, -2)
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
    }, []);
    const redirect = () => {
        props.history.push('/')
    }
    //make sure that bookings are properly populated with the tutor/subject objects before accessing their properties
    if (!loading) {
        if (bookings.length > 0) {
            return (
                <div>
                    {
                        UserService.isAuthenticated() ? <p>Hello {UserService.getCurrentUser().email}!
                    Your first booking is tutored by: {bookings[0].tutor.firstname}</p> : redirect()}
                </div>
            )
        }
    }
    return (
        <div>
            <p>You currently don't have any bookings.</p>
        </div>
    )
}

export default CurrentBookingsView
