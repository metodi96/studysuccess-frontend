import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Typography, IconButton, Snackbar, CardActions, Tooltip } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Alert from './Alert';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        position: 'relative',
        marginRight: '20px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
});

function TimePreference({ timePreference }) {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classes = useStyles();

    const removeTimepreference = () => {
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios.delete(`http://localhost:5000/profile/${timePreference._id}`,
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

    const mapDayNumberToString = (day) => {
        switch (day) {
            case 1: return 'Monday'
            case 2: return 'Tuesday'
            case 3: return 'Wednesday'
            case 4: return 'Thursday'
            case 5: return 'Friday'
            case 6: return 'Saturday'
            case 0: return 'Sunday'
            default:
                return 'No day'
        }
    }


    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Time preference removed!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Time preference couldn't be removed!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };
    return (
        <div style={{marginTop: '10px'}}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Day: {mapDayNumberToString(timePreference.day)}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        Timeslot start: {`${timePreference.startTime.hours}:${timePreference.startTime.minutes}`}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        Timeslot end: {`${timePreference.endTime.hours}:${timePreference.endTime.minutes}`}
                    </Typography>
                </CardContent>
                <Tooltip title="Remove time preference" aria-label="remove-timepreference">
                    <IconButton onClick={removeTimepreference} disabled={disabled} style={{ position: 'absolute', right: '0%', top: '0%' }} size='small' aria-label="delete-preference">
                        <HighlightOffIcon color="secondary" />
                    </IconButton>
                </Tooltip>
            </Card>
            {
                renderSwitchForSnackbar(severity)
            }
        </div>
    )
}

export default TimePreference
