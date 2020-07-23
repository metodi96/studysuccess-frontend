import React, { useState, useEffect } from 'react';
import SubjectToTakeLessonsIn from './SubjectToTakeLessonsIn';
import { MenuItem, Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';

function ProfileSubjects({ classesProfile, classesSelect, profile, classesField, classesButton }) {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');

    const initialValues = {
        subject: ''
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        subject: Yup.string().required('You have to choose a subject'),
    })

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                if (isMounted) {
                    const allSubjects = res.data;
                    const profileSubjects = profile.subjectsToTakeLessonsIn;
                    if(profileSubjects) {
                        setSubjects(allSubjects.filter(function (subject) {
                            return !profileSubjects.find(function (subjectProfile) {
                                return subject._id === subjectProfile._id;
                            })
                        }));
                    }                
                    else {
                        setSubjects(allSubjects);
                    }
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
            });
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [profile.subjectsToTakeLessonsIn]);

    const addSubject = (values) => {
        console.log(values);
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios
                .put(`http://localhost:5000/profile/addSubjectToTakeLessonsIn`,
                    { subjectId: values.subject },
                    {
                        headers: headers
                    })
                .then(() => {
                    console.log('Subject added successfully.');
                    setSeverity('success');
                })
                .catch(err => {
                    console.log(err.response.data);
                    setSeverity('error');
                });

        }
    }

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

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
                        Subject added!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Couldn't add the selected subject. Try again!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    return (
        <div className={classesProfile.container} style={{paddingTop: '0px'}}>
            <div>
                {
                    !loading ?
                        <div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={addSubject}>
                                {
                                    formik => (
                                        <Form>
                                            <div>
                                                <h2 style={{ color: 'slategrey', marginLeft: '73px' }}>I want to learn:</h2>
                                                <div style={{ marginTop: '20px' }}>
                                                    {
                                                        profile.subjectsToTakeLessonsIn !== undefined ?
                                                            profile.subjectsToTakeLessonsIn.map(subject => (
                                                                <SubjectToTakeLessonsIn classesField={classesField} key={subject._id} subject={subject} />
                                                            )) : null
                                                    }
                                                </div>
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    name="subject"
                                                    label="Subject"
                                                    select
                                                    variant="outlined"
                                                    helperText="Please select one of the options"
                                                    classes={classesSelect}
                                                >
                                                    {subjects.map(option => (
                                                        <MenuItem key={option._id} value={option._id}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                                <div style={{ marginLeft: '62px' }}>
                                                    <Button classes={classesButton} disabled={!(formik.isValid && formik.dirty) || disabled}
                                                        type="submit" color="primary" variant='outlined' onClick={handleOpenSnackbar}>
                                                        Add subject
                                                </Button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        : <span>Subjects loading...</span>
                }
            </div>
            {
                renderSwitchForSnackbar(severity)
            }
        </div>
    )
}

export default ProfileSubjects
