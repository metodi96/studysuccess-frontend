import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import DialogContentText from '@material-ui/core/DialogContentText';
import Invitation from './Invitation';

function InviteFriend({ booking, classesAvatar, openInvitationAlert, setOpenInvitationAlert }) {
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialValues = {
        email: '',
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format'),
    })

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get(`http://localhost:5000/bookings/current/${booking._id}/invitations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.slice(10, -2)}`
                        }
                    })
                .then(res => {
                    setInvitations(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [token, booking._id]);

    const inviteFriend = values => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Inviting friend with email ${values.email} ${booking._id} now...`);
            if (booking._id !== undefined) {
                axios.post(`http://localhost:5000/bookings/current/invite/`,
                    {
                        friendEmail: values.email,
                        bookingId: booking._id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token.slice(10, -2)}`
                        }
                    })
                    .then(() => {
                        handleCloseInvitationAlert();
                        window.location.reload(true);
                    })
                    .catch(err => {
                        handleCloseInvitationAlert();
                        window.location.reload(true);
                        //use this to precisely tell what the response from the server is
                        console.log('response: ', err.response.data);
                    })
            }
        }
    }

    const handleCloseInvitationAlert = () => {
        setOpenInvitationAlert(false);
    };

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get(`http://localhost:5000/bookings/current/${booking._id}/invitations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.slice(10, -2)}`
                        }
                    })
                .then(res => {
                    setInvitations(res.data);
                })
                .catch(err => {
                    console.log('response: ', err.response.data);
                })
        }
    }, [token, booking._id]);


    return (
        <div>
            <Dialog
                open={openInvitationAlert}
                onClose={handleCloseInvitationAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Would you like to invite some friends to this tutorial?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your tutor might decide to charge you more for each friend you invite.
                            </DialogContentText>
                    {
                        !loading ?
                            invitations.map(invitation => (<Invitation key={invitation._id} bookingId={booking._id} classesAvatar={classesAvatar} invitation={invitation} />))
                            :
                            <span>Loading friends...</span>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInvitationAlert} color="primary" autoFocus>
                        No
                            </Button>
                    <Formik
                        initialValues={initialValues}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validationSchema={validationSchema}
                        onSubmit={inviteFriend}>
                        <Form>
                            <div className='form-control'>
                                <label htmlFor='email'></label>
                                <Field
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='Email'
                                />
                                <ErrorMessage name='email'>
                                    {errorMsg => <div className='error'>{errorMsg}</div>}
                                </ErrorMessage>
                            </div>
                            <Button type="submit" color="primary">
                                Yes
                            </Button>
                        </Form>
                    </Formik>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default InviteFriend
