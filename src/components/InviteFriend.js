import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import DialogContentText from '@material-ui/core/DialogContentText';
import Invitation from './Invitation';
import Snackbar from '@material-ui/core/Snackbar';
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import UserService from '../services/UserService';
import Alert from './Alert';

const useStylesEmail = makeStyles(() => ({
    root: {
        '& input': {
            border: '1px solid black',
            backgroundColor: 'white !important',
            padding: '5px 5px 5px 5px',
            borderRadius: '4px',
            height: '30px'
        },
        '& input:hover': {
            border: '1px solid black',
            backgroundColor: 'white !important',
        },
        marginBottom: '20px',
        marginRight: '50px',
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        float: 'left',
        marginRight: '10px'
    }
}));

const useStylesDialog = makeStyles(() => ({
    root: {
        minWidth: '600px'
    }
}));

function InviteFriend({ booking, classesAvatar, openInvitationAlert, setOpenInvitationAlert }) {
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    const classesEmail = useStylesEmail();
    const classesButton = useStylesButton();
    const classesDialog = useStylesDialog();

    const initialValues = {
        email: '',
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Please enter a email address'),
    })

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
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
                    if (isMounted) {
                        setInvitations(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, booking._id]);

    const inviteFriend = values => {
        setToken(window.localStorage.getItem('jwtToken'));
        let friendAlreadyInvited = invitations.some(invitation => invitation.toUser.email === values.email);
        let friendIsMe = UserService.getCurrentUser().email === values.email;
        console.log('Booking ID')
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Inviting friend with email ${values.email} ${booking._id} now...`);
            if (booking._id !== undefined && !friendAlreadyInvited && !friendIsMe) {
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
                        setSeverity('success');
                    })
                    .catch(err => {
                        setSeverity('error');
                        //use this to precisely tell what the response from the server is
                        console.log('response: ', err.response.data);
                    })
            } else if (friendAlreadyInvited) {
                setSeverity('warning');
            } else if (friendIsMe) {
                setSeverity('warningMe');
            }
        }
    }

    const handleCloseInvitationAlert = () => {
        setOpenInvitationAlert(false);
    };

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
        setSeverity('');
        handleCloseInvitationAlert();
        window.location.reload(true);
    };

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
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
                    if (isMounted) {
                        setInvitations(res.data);
                    }
                })
                .catch(err => {
                    console.log('response: ', err.response.data);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, booking._id]);

    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Friend invited successfully!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        There is no such user with the given email!
                        </Alert>
                </Snackbar>
            case 'warning':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='warning'>
                        You have already invited this user!
                    </Alert>
                </Snackbar>
            case 'warningMe':
                    return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity='warning'>
                            You can't invite yourself!
                        </Alert>
                    </Snackbar>
            default:
                return null
        }
    };

    return (
        <div>
            <Dialog
                open={openInvitationAlert}
                onClose={handleCloseInvitationAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={classesDialog}>
                <DialogTitle id="alert-dialog-title">{"Would you like to invite some friends to this tutorial?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{textAlign: 'center'}}>
                        Enter the email of an already registered user,<br/>who you'd like to invite to this tutorial, in the text field below.
                            </DialogContentText>
                    {
                        !loading ?
                            invitations.map(invitation => (<Invitation key={invitation._id} bookingId={booking._id} classesAvatar={classesAvatar} invitation={invitation} />))
                            :
                            <span>Loading friends...</span>
                    }
                </DialogContent>
                <DialogActions>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={inviteFriend}>
                        {(formik) => (
                            <Form>
                                <div>
                                    <Field
                                        component={TextField}
                                        classes={classesEmail}
                                        type='email'
                                        id='email'
                                        name='email'
                                        placeholder='Email of the friend'
                                    />
                                </div>
                                <Button classes={classesButton} onClick={handleCloseInvitationAlert} color="primary" autoFocus>
                                    No
                                </Button>
                                <Button classes={classesButton} disabled={!(formik.isValid && formik.dirty)} type="submit" color="primary" onClick={handleOpenSnackbar}>
                                    Yes
                            </Button>
                            </Form>
                        )}
                    </Formik>
                </DialogActions>
            </Dialog>
            {
                renderSwitchForSnackbar(severity)
            }
        </div>
    )
}

export default InviteFriend
