import React, { useState  } from 'react';
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
import moment from 'moment';
import InviteFriend from './InviteFriend';
import CancelBooking from './CancelBooking';
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
    },
}));

const useStylesInvitation = makeStyles(() => ({
    root: {
        marginRight: '5px'
    },
}));

function CurrentBookingOwn({ booking }) {

    const classesList = useStylesList();
    const classesAvatar = useStylesAvatar();
    const classesButton = useStylesButton();
    const classesInvitation = useStylesInvitation();
    const [openAlert, setOpenAlert] = useState(false);
    const [openInvitationAlert, setOpenInvitationAlert] = useState(false);

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleClickOpenInvitationAlert = () => {
        setOpenInvitationAlert(true);
    };

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
                    <InviteFriend booking={booking} classesAvatar={classesAvatar} openInvitationAlert={openInvitationAlert} setOpenInvitationAlert={setOpenInvitationAlert} />
                    <CancelBooking booking={booking} openAlert={openAlert} setOpenAlert={setOpenAlert} />
                </ListItem>
            </List>
        </div >
    )
}

export default CurrentBookingOwn
