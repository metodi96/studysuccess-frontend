import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import SchoolSharpIcon from '@material-ui/icons/SchoolSharp';
import EventBusySharpIcon from '@material-ui/icons/EventBusySharp';
import Divider from '@material-ui/core/Divider';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import GroupSharpIcon from '@material-ui/icons/GroupSharp';
import EuroSharpIcon from '@material-ui/icons/EuroSharp';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Button } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';

const useStylesList = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 390,
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
        marginRight: '5px',
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkgreen',
        }
    }
}));

function PendingBookingTutor({ bookingPending }) {
    const classesList = useStylesList();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const classesInvitation = useStylesInvitation();
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    const acceptInvitation = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Accepting proposed time now...`);
            axios.put(`http://localhost:5000/bookings/acceptProposedTime/${bookingPending._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(() => {
                    console.log('Accepted proposed time!')
                    window.location.reload();
                })
                .catch(err => {
                    //use this to precisely tell what the response from the server is
                    console.log('response: ', err.response.data);
                })
        }
    }

    const rejectInvitation = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios.delete(`http://localhost:5000/bookings/current/${bookingPending._id}/cancel`,
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log('Booking successfully deleted');
                    window.location.reload(true);
                })
                .catch(err => {
                    console.log('response: ', err.response.data);
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
                    <ListItemText primary="Subject" secondary={bookingPending.subject !== null && bookingPending !== null ? bookingPending.subject.name : '...'} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EventBusySharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Date and time" secondary={`${moment(bookingPending.timeslotStart).format("dddd, MMMM Do YYYY, h:mm a")} - ${moment(bookingPending.timeslotEnd).format("dddd, MMMM Do YYYY, h:mm a")}`} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        {
                            bookingPending.tutor.userImage ?
                                <Avatar alt={`${bookingPending.tutor.firstname} ${bookingPending.tutor.lastname}`} src={`http://localhost:5000/${bookingPending.tutor.userImage}`} />
                                :
                                <Avatar classes={classesAvatar}>
                                    <PersonOutlineSharpIcon color='primary' />
                                </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary="Tutor" secondary={bookingPending.tutor.firstname} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        {
                            bookingPending.user.userImage ?
                                <Avatar alt={`${bookingPending.user.firstname} ${bookingPending.user.lastname}`} src={`http://localhost:5000/${bookingPending.user.userImage}`} />
                                :
                                <Avatar classes={classesAvatar}>
                                    <PersonOutlineSharpIcon color='primary' />
                                </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary="Invited by" secondary={bookingPending.user.firstname} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <GroupSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Participants" secondary={bookingPending.participantNumber} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EuroSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Price" secondary={`${bookingPending.tutor.pricePerHour}€`} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem classes={classesButton}>
                    <Button
                        classes={classesInvitation}
                        variant="contained"
                        startIcon={<CheckCircleOutlineOutlinedIcon />}
                        onClick={acceptInvitation}>
                        Accept
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<HighlightOffIcon />}
                        onClick={rejectInvitation}>
                        Reject
                    </Button>
                </ListItem>
            </List>
        </div>
    )
}

export default PendingBookingTutor
