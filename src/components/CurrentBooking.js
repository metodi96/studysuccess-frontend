import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SchoolSharpIcon from '@material-ui/icons/SchoolSharp';
import EventBusySharpIcon from '@material-ui/icons/EventBusySharp';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import GroupSharpIcon from '@material-ui/icons/GroupSharp';
import EuroSharpIcon from '@material-ui/icons/EuroSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import moment from 'moment'
import UserService from '../services/UserService';
import Invitation from './Invitation';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '20px'
    },
}));

const useStylesAvatar = makeStyles(() => ({
    root: {
        backgroundColor: 'white',
        border: '1px solid #757ce8'
    },
}));

const useStylesButton = makeStyles(() => ({
    root: {
        justifyContent: 'center'
    },
}));

const useStylesInvitation = makeStyles(() => ({
    root: {
        marginRight: '5px'
    },
}));

function CurrentBooking({ booking }) {

    const initialValues = {
        email: '',
    }
    const classes = useStyles();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const classesInvitation = useStylesInvitation();
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const [openInvitationAlert, setOpenInvitationAlert] = useState(false);

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

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleClickOpenInvitationAlert = () => {
        setOpenInvitationAlert(true);
    };

    const handleCloseInvitationAlert = () => {
        setOpenInvitationAlert(false);
    };

    const inviteFriend = values => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Inviting friend with email ${values.email} ${booking._id} now...`)
            console.log(UserService.getCurrentUser().userId)
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
                    .then(res => {
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

    const cancelBooking = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            console.log(booking._id);
            axios
                .delete(`http://localhost:5000/bookings/current/${booking._id}/cancel`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.slice(10, -2)}`
                        }
                    })
                .then(res => {
                    console.log(res.data);
                    window.location.reload(true);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    return (
        <div>
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <SchoolSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Subject" secondary={booking.subject !== null ? booking.subject.name : '...'} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EventBusySharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Date and time" secondary={`${moment(booking.timeslotStart).format("dddd, MMMM Do YYYY, h:mm a")} - ${moment(booking.timeslotEnd).format("dddd, MMMM Do YYYY, h:mm a")}`} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        {
                            booking.tutor.userImage ?
                                <Avatar alt={`${booking.tutor.firstname} ${booking.tutor.lastname}`} src={`http://localhost:5000/${booking.tutor.userImage}`} />
                                :
                                <Avatar classes={classesAvatar}>
                                    <PersonOutlineSharpIcon color='primary' />
                                </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary="Tutor" secondary={booking.tutor.firstname} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <GroupSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Participants" secondary={booking.participantNumber} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EuroSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Price" secondary={`${booking.tutor.pricePerHour}€`} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem classes={classesButton}>
                    <Button
                        classes={classesInvitation}
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddOutlinedIcon />}
                        onClick={handleClickOpenInvitationAlert}>
                        Invite friends
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={handleClickOpenAlert}>
                        Cancel
                    </Button>
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
                                    invitations.map(invitation => (<Invitation key={invitation._id} bookingId={booking._id} classesAvatar={classesAvatar} invitation={invitation}/> ))
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
                </ListItem>
            </List>
        </div >
    )
}

export default CurrentBooking
