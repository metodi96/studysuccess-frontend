import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import PendingBooking from '../components/PendingBooking';
import styles from './bookingsStyles.module.css';

function PendingBookingsView(props) {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get('http://localhost:5000/bookings/pending', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setInvitations(res.data);
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
            if (invitations.length > 0) {
                return (
                    <div>
                        <h3 className={styles.heading}>You have {invitations.length} invitations.</h3>
                        <div className={styles.container}>
                        { invitations.sort((invitationA, invitationB) => invitationB.createdAt.localeCompare(invitationA.createdAt)).map((invitation) => (<div key={invitation._id} className={styles.booking}><PendingBooking invitation={invitation} /></div>)) }
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

export default PendingBookingsView
