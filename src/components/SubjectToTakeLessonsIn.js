import React, { useState } from 'react';
import { TextField, Tooltip, IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';

function SubjectToTakeLessonsIn({ subject, classesField }) {

    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');

    const removeSubject = () => {
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios
                .put(`http://localhost:5000/profile/removeSubjectToTakeLessonsIn`,
                    { subjectId: subject._id },
                    {
                        headers: headers
                    })
                .then(res => {
                    console.log('Subject removed successfully.');
                    setOpenSnackbar(true);
                    setSeverity('success');
                })
                .catch(err => {
                    console.log(err.response.data);
                    setOpenSnackbar(true);
                    setSeverity('error');
                });

        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);

        if (severity === 'success') {
            setSeverity('');
            window.location.reload(true);
        } else {
            setSeverity('');
            window.location.reload(true);
        }
    };

    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Subject removed!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Couldn't remove the selected subject. Try again!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    return (
        <div>
            <div>
                <TextField
                    classes={classesField}
                    type='text'
                    variant="outlined"
                    label='Subject'
                    value={subject.name}
                    disabled
                />
                <Tooltip title="Remove subject" aria-label="remove-subject">
                    <IconButton style={{ marginLeft: '20px' }} onClick={removeSubject} disabled={disabled} size='medium' aria-label="delete-subject">
                        <HighlightOffIcon color="secondary" />
                    </IconButton>
                </Tooltip>
            </div>
            {
                renderSwitchForSnackbar(severity)
            }
        </div>
    )
}

export default SubjectToTakeLessonsIn
