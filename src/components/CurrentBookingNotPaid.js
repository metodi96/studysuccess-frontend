import React, { useState } from 'react';
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
import { Typography } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const useStylesList = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 390,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
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
    }
}));

function CurrentBookingNotPaid({ booking, token }) {

    const classesList = useStylesList();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const [disabledPay, setDisabledPay] = useState(false);

    const payTutorial = () => {
        console.log('Normal submit with other pay route')
        console.log(booking.timeslotStart)
        console.log(booking.timeslotEnd)
        setDisabledPay(true);
        if (token) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios.post('http://localhost:5000/bookings/payAccepted',
                {
                    firstname: booking.tutor.firstname,
                    lastname: booking.tutor.lastname,
                    price: booking.tutor.pricePerHour,
                    timeslotStart: booking.timeslotStart,
                    timeslotEnd: booking.timeslotEnd,
                    participantNumber: 1,
                    tutor: booking.tutor._id,
                    subject: booking.subject._id,
                    bookingId: booking._id
                },
                {
                    headers: headers,
                    maxRedirects: 0
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        window.location = res.data.forwardLink;
                    }
                })
                .catch(err => {
                    console.log(`Something went wrong with payment ${err}`);
                })
        }
    }

    return (
        <div>
            <List className={classesList.root}>
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
                            <MailOutlineIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Email" secondary={booking.tutor.email} />
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
                {
                    booking.acceptedByTutor ?
                        <ListItem classes={classesButton}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={disabledPay}
                                onClick={payTutorial}>
                                Pay for tutorial
                        </Button>
                        </ListItem> :
                        <ListItem classes={classesButton}>
                            <Typography>Pending tutor approval...</Typography>
                        </ListItem>
                }
            </List>
        </div >
    )
}

export default CurrentBookingNotPaid
