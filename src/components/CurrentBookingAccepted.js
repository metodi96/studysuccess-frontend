import React from 'react';
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
import moment from 'moment';

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

function CurrentBookingAccepted({ invitation }) {

    const classesList = useStylesList();
    const classesAvatar = useStylesAvatar();

    return (
        <div>
            {invitation.booking !== null ?
                <List className={classesList.root}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar classes={classesAvatar}>
                                <SchoolSharpIcon color='primary' />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Subject" secondary={invitation.booking.subject !== null && invitation.booking.subject !== undefined ? invitation.booking.subject.name : '...'} />
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
                </List> : null
            }
        </div >
    )
}

export default CurrentBookingAccepted
