import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import PendingBooking from '../components/PendingBooking';
import { makeStyles } from '@material-ui/core';
import confused from '../images/confused-cat.png'

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

function PendingBookingsView(props) {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesBooking = useStylesBooking();

    useEffect(() => {
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
                        <h3 className={classesBooking.heading}>You have {invitations.length} invitations.</h3>
                        <div className={classesBooking.container}>
                            {invitations.sort((invitationA, invitationB) => invitationB.createdAt.localeCompare(invitationA.createdAt)).map((invitation) => (<div key={invitation._id} className={classesBooking.booking}><PendingBooking history={props.history} invitation={invitation} /></div>))}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{ fontSize: '1.35rem', textAlign: 'center', marginTop: '50px', height: '64vh' }}>
                        <div>
                            <span>You currently don't have any pending invitations.</span>
                        </div>
                        <img width='200px' height='200px' src={confused} />
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
