import React, { useState } from 'react';
import { TextField, Tooltip, IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';

function SubjectToTakeLessonsIn({ subject, classesField }) {

    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

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
                    //window.location.reload();
                })
                .catch(err => {
                    console.log(err.response.data);
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
                    <IconButton style={{ marginLeft: '20px' }} onClick={removeSubject} disabled={disabled} size='medium' aria-label="delete-subject">
                        <HighlightOffIcon color="secondary" />
                    </IconButton>
                </Tooltip>
            </div>
            <div>

            </div>
        </div>
    )
}

export default SubjectToTakeLessonsIn
