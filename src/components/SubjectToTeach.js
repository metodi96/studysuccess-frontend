import React, { useState } from 'react';
import { TextField, Tooltip, IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import Alert from './Alert';
import Snackbar from '@material-ui/core/Snackbar';

function SubjectToTeach({ subject, classesField }) {

    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [openSnackbarSubjectsToTeach, setOpenSnackbarSubjectsToTeach] = useState(false);
    const [severitySubjects, setSeveritySubjects] = useState('');

    const handleOpenSnackbarSubjectsToTeach = () => {
        setOpenSnackbarSubjectsToTeach(true);
    };

    const handleCloseSnackbarSubjectsToTeach = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbarSubjectsToTeach(false);

        if (severitySubjects === 'success') {
            setSeveritySubjects('');
            window.location.reload(true);
        } else {
            setSeveritySubjects('');
            window.location.reload(true);
        }
    };

    const renderSwitchForSnackbarSubjectsToTeach = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbarSubjectsToTeach} autoHideDuration={1500} onClose={handleCloseSnackbarSubjectsToTeach}>
                    <Alert onClose={handleCloseSnackbarSubjectsToTeach} severity='success'>
                        Subject removed!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbarSubjectsToTeach} autoHideDuration={1500} onClose={handleCloseSnackbarSubjectsToTeach}>
                    <Alert onClose={handleCloseSnackbarSubjectsToTeach} severity='error'>
                        Couldn't remove selected subject. Try again!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };


    const removeSubject = () => {
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        handleOpenSnackbarSubjectsToTeach();
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(subject);
            axios
                .put(`http://localhost:5000/profile/removeSubjectToTeach`,
                    { subjectId: subject._id },
                    {
                        headers: headers
                    })
                .then(res => {
                    console.log('Subject removed successfully.');
                    setSeveritySubjects('success');
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err.response.data);
                    setSeveritySubjects('error');
                });

        }
    }

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
                    <IconButton style={{ marginLeft: '20px' }} onClick={removeSubject} disabled={disabled} size='medium' aria-label="delete-subject" >
                        <HighlightOffIcon color="secondary" />
                    </IconButton>
                </Tooltip>
                {
                    renderSwitchForSnackbarSubjectsToTeach(severitySubjects)
                }
            </div>
            <div>

            </div>
        </div>
    )
}

export default SubjectToTeach