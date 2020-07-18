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

function PendingBooking({ history, invitation }) {
    const classesList = useStylesList();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const classesInvitation = useStylesInvitation();
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    const acceptInvitation = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Accepting invitation now...`);
            console.log(token)
            axios.post(`http://localhost:5000/bookings/pending/${invitation._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(() => {
                    console.log('Success!')
                    redirectToCurrent();
                })
                .catch(err => {
                    window.location.reload(true);
                    //use this to precisely tell what the response from the server is
                    console.log('response: ', err.response.data);
                })
        }
    }

    const rejectInvitation = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios.delete(`http://localhost:5000/bookings/current/${invitation.booking._id}/invitations/${invitation._id}`,
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
                    console.log('response: ', err.response.data);
                })
        }
    }

    const redirectToCurrent = () => {
        history.push('/bookings/current');
        window.location.reaload();
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
                    <ListItemText primary="Subject" secondary={invitation.booking.subject !== null && invitation.booking !== null ? invitation.booking.subject.name : '...'} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EventBusySharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Date and time" secondary={`${moment(invitation.booking.timeslotStart).format("dddd, MMMM Do YYYY, h:mm a")} - ${moment(invitation.booking.timeslotEnd).format("dddd, MMMM Do YYYY, h:mm a")}`} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        {
                            invitation.booking.tutor.userImage ?
                                <Avatar alt={`${invitation.booking.tutor.firstname} ${invitation.booking.tutor.lastname}`} src={`http://localhost:5000/${invitation.booking.tutor.userImage}`} />
                                :
                                <Avatar classes={classesAvatar}>
                                    <PersonOutlineSharpIcon color='primary' />
                                </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary="Tutor" secondary={invitation.booking.tutor.firstname} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        {
                            invitation.fromUser.userImage ?
                                <Avatar alt={`${invitation.fromUser.firstname} ${invitation.fromUser.lastname}`} src={`http://localhost:5000/${invitation.fromUser.userImage}`} />
                                :
                                <Avatar classes={classesAvatar}>
                                    <PersonOutlineSharpIcon color='primary' />
                                </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary="Invited by" secondary={invitation.fromUser.firstname} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <GroupSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Participants" secondary={invitation.booking.participantNumber} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar classes={classesAvatar}>
                            <EuroSharpIcon color='primary' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Price" secondary={`${invitation.booking.tutor.pricePerHour}€`} />
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

export default PendingBooking
