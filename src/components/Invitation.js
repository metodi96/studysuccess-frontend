import React, { useState } from 'react';
import axios from 'axios';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import Alert from './Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';

function Invitation({ bookingId, invitation, classesAvatar }) {
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [disabled, setDisabled] = useState(false);

    const removeInvitation = () => {
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios.delete(`http://localhost:5000/bookings/current/${bookingId}/invitations/${invitation._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    setSeverity('success');
                    setOpenSnackbar(true);
                    console.log(res.data);
                })
                .catch(err => {
                    setSeverity('error');
                    console.log('response: ', err.response.data);
                })
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
        setSeverity('');
        window.location.reload(true);
    };


    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Friend removed successfully!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Friend couldn't be removed!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    return (
        <div style={{ verticalAlign: 'top', display: 'inline-block', marginLeft: '5px', marginRight: '5px' }} key={invitation._id}>
            {invitation.toUser.userImage ?
                <div>
                    <div style={{
                        position: 'relative'
                    }}>
                        <Avatar style={{ margin: 'auto' }} alt={`${invitation.toUser.firstname} ${invitation.toUser.lastname}`} src={`http://localhost:5000/${invitation.toUser.userImage}`} />
                        {
                            invitation.accepted ?
                                <Tooltip title="Invitation accepted" aria-label="invitation-accepted"><CheckCircleOutlineOutlinedIcon size='small' style={{ color: 'green', right: '0', bottom: '50%', position: 'absolute' }} /></Tooltip>
                                :
                                <Tooltip title="Remove invitation" aria-label="remove-invitation">
                                    <IconButton onClick={removeInvitation} disabled={disabled} size='small' style={{ right: '0', bottom: '50%', position: 'absolute' }} aria-label="delete">
                                        <HighlightOffIcon color="secondary" />
                                    </IconButton>
                                </Tooltip>
                        }
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
                        {
                            invitation.accepted ?
                                <Tooltip title="Invitation accepted" aria-label="invitation-accepted"><CheckCircleOutlineOutlinedIcon size='small' style={{ color: 'green', right: '0', bottom: '50%', position: 'absolute' }} /></Tooltip>
                                :
                                <Tooltip title="Remove invitation" aria-label="remove-invitation">
                                    <IconButton onClick={removeInvitation} disabled={disabled} size='small' style={{ right: '0', bottom: '50%', position: 'absolute' }} aria-label="delete">
                                        <HighlightOffIcon color="secondary" />
                                    </IconButton>
                                </Tooltip>
                        }
                    </div>
                    <p style={{ display: 'block', textAlign: 'center' }}>{`${invitation.toUser.firstname} ${invitation.toUser.lastname}`}</p>
                </div>
            }
            <div>
                {
                    renderSwitchForSnackbar(severity)
                }
            </div>

        </div>
    )
}

export default Invitation
