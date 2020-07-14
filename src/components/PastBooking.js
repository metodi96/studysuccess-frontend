import React, { useState } from 'react'
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
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';

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

const useStylesTutor = makeStyles(() => ({
    rating: {
        display: 'flex'
    },
    container: {
        display: 'flex',
        marginTop: '50px'
    },
    availability: {
        marginLeft: '200px'
    }
}));

function PastBooking({ booking }) {
    const classes = useStyles();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const classesTutor = useStylesTutor();
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [openAlert, setOpenAlert] = useState(false);
    const [rating, setRating] = React.useState(5);

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const initialValues = {
        comment: ''
    }
    
    // define the validation object schema
    const validationSchema = Yup.object({
        comment: Yup.string().required('This field is obligatory')
    })

    const onSubmit = comment => {
        console.log(comment)
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            console.log(booking._id);
            axios
                .post(`http://localhost:5000/bookings/past/${booking._id}/feedback/add`, 
                {rating: rating, comment: comment.comment, tutorId: booking.tutor._id, forSubject: booking.subject},
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    //window.location.reload(true);
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
                        <Avatar classes={classesAvatar}>
                            <PersonOutlineSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Tutor" secondary={ booking.tutor !== null ? booking.tutor.firstname : 'No tutor defined for this booking'} />
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
                    <ListItemText primary="Price" secondary={ booking.tutor !== null ? `${booking.tutor.pricePerHour}€` : 'No price defined for this booking'} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem classes={classesButton}>
                    {
                        !booking.feedbackGiven ? <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClickOpenAlert}>
                            Give Feedback
                        </Button> : <div>Feedback already given.</div>
                    }
                    
                    <Dialog
                        open={openAlert}
                        onClose={handleCloseAlert}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{"Please provide your feedback"}</DialogTitle>
                        <DialogContent>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                validateOnBlur={false}
                                validateOnChange={false}
                                onSubmit={onSubmit}>
                                <Form>
                                    <div className='form-control'>
                                        <label htmlFor='comment'></label>
                                        <Field
                                            type='text'
                                            id='comment'
                                            name='comment'
                                            placeholder={`Enter comment here`}
                                            as="textarea"
                                        />
                                        <ErrorMessage name='comment' component={TextError} />
                                    </div>
                                    <div className={classesTutor.rating}>
                                        <Rating 
                                            name="session-rating" 
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                        />
                                        <Typography component="legend">{rating}</Typography>
                                    </div>
                                    <Button type='submit' color="primary" bottom = {10}>Submit</Button>
                                    <Button onClick={handleCloseAlert} color="primary" autoFocus>
                                       Cancel
                                    </Button>
                                </Form>
                            </Formik>                            
                        </DialogContent>
                    </Dialog>
                </ListItem>
            </List>
        </div>
    )
}

export default PastBooking
