import React, { useState } from 'react';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import axios from 'axios';

function CancelBooking({ booking, openAlert, setOpenAlert }) {
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    const cancelBooking = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            console.log(booking._id);
            axios.delete(`http://localhost:5000/bookings/current/${booking._id}/cancel`,
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    },
                    data: {
                        timePreferenceId: booking.timePreferenceId,
                        week: booking.week
                    }
                })
                .then(res => {
                    console.log(res.data);
                    window.location.reload(true);
                })
                .catch(err => {
                    console.log('damn')
                    console.log(err);
                })
        }
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <div>
            <Dialog
                open={openAlert}
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to cancel this booking?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This booking is for the subject <b>{booking.subject.name}</b> and is scheduled for <b>{moment(booking.timeslotStart).format("dddd, MMMM Do YYYY, h:mm a")}</b> until <b>{moment(booking.timeslotEnd).format("dddd, MMMM Do YYYY, h:mm a")}</b>.
                                The tutor is <b>{booking.tutor.firstname} {booking.tutor.lastname}</b>.
                            </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert} color="primary" autoFocus>
                        No
                            </Button>
                    <Button onClick={cancelBooking} color="primary">
                        Yes
                            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default CancelBooking
