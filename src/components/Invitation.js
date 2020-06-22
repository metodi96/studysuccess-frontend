import React, { useState } from 'react';
import axios from 'axios';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';

function Invitation({ bookingId, invitation, classesAvatar }) {
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    const removeInvitation = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios.delete(`http://localhost:5000/bookings/current/${bookingId}/invitations/${invitation._id}`,
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

    return (
        <div style={{ verticalAlign: 'top', display: 'inline-block', marginLeft: '5px', marginRight: '5px' }} key={invitation._id}>
            {invitation.toUser.userImage ?
                <div>
                    <div style={{
                        position: 'relative'
                    }}>
                        <Avatar style={{ margin: 'auto' }} alt={`${invitation.toUser.firstname} ${invitation.toUser.lastname}`} src={`http://localhost:5000/${invitation.toUser.userImage}`} />
                        <IconButton onClick={removeInvitation} size='small' style={{ right: '0', bottom: '50%', position: 'absolute' }} aria-label="delete">
                            <HighlightOffIcon color="secondary" />
                        </IconButton>
                    </div>
                    <p style={{ display: 'block', textAlign: 'center' }}>{`${invitation.toUser.firstname} ${invitation.toUser.lastname}`}</p>
                </div>
                :
                <div>
                    <div style={{
                        position: 'relative'
                    }}>
                        <Avatar style={{ margin: 'auto' }} key={invitation._id} alt={`${invitation.toUser.firstname} ${invitation.toUser.lastname}`} classes={classesAvatar}>
                            <PersonOutlineSharpIcon color='primary' />
                        </Avatar>
                        <IconButton onClick={removeInvitation} size='small' style={{ right: '0', bottom: '50%', position: 'absolute' }} aria-label="delete">
                            <HighlightOffIcon color="secondary" />
                        </IconButton>
                    </div>
                    <p style={{ display: 'block', textAlign: 'center' }}>{`${invitation.toUser.firstname} ${invitation.toUser.lastname}`}</p>
                </div>
            }
        </div>
    )
}

export default Invitation
