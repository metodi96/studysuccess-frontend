import React, { useState, useEffect } from 'react';
import SubjectToTeach from './SubjectToTeach';
import { MenuItem, Button, Divider } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import TextFieldNormal from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';
import TimePreference from './TimePreference';

const useStylesTimeslot = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
        maxHeight: '300px',
        paddingRight: '10px'
    }
}));

const useStylesTimepicker = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

function ProfileTutorSubjects({ classesProfile, classesSelect, profile, classesField, classesButton }) {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [disabledTimeslot, setDisabledTimeslot] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [timeslotFrom, setTimeslotFrom] = useState('');
    const [timeslotTo, setTimeslotTo] = useState('');
    const classesTimePicker = useStylesTimepicker();
    const classesTimeslot = useStylesTimeslot();
    const [openSnackbarSubjects, setOpenSnackbarSubjects] = useState(false);
    const [severitySubjects, setSeveritySubjects] = useState('');
    const [openSnackbarTimeslots, setOpenSnackbarTimeslots] = useState(false);
    const [severityTimeslots, setSeverityTimeslots] = useState('');
    const [timePreferences, setTimePreferences] = useState([]);
    const [showWarningIncluded, setShowWarningIncluded] = useState(false);

    const days = [
        {
            value: 1,
            label: 'Monday'
        },
        {
            value: 2,
            label: 'Tuesday'
        },
        {
            value: 3,
            label: 'Wednesday'
        },
        {
            value: 4,
            label: 'Thursday'
        },
        {
            value: 5,
            label: 'Friday'
        },
        {
            value: 6,
            label: 'Saturday'
        },
        {
            value: 0,
            label: 'Sunday'
        },
    ];

    const initialValues = {
        subject: ''
    }

    const initialValuesTimeslot = {
        day: ''
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        subject: Yup.string().required('You have to choose a subject'),
    })

    // define the validation object schema
    const validationSchemaTimeslot = Yup.object({
        day: Yup.string().required('You have to choose a day'),
    })

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                if (isMounted) {
                    const allSubjects = res.data;
                    const profileSubjects = profile.subjectsToTeach;
                    if (profileSubjects) {
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
    }, [profile.subjectsToTeach]);

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            axios
                .get("http://localhost:5000/profile/timeslots",
                    {
                        headers: headers
                    })
                .then(res => {
                    if (isMounted) {
                        setTimePreferences(res.data)
                        console.log(res.data)
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

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
                .put(`http://localhost:5000/profile/addSubjectToTeach`,
                    { subjectId: values.subject },
                    {
                        headers: headers
                    })
                .then(() => {
                    console.log('Subject added successfully.');
                    setSeveritySubjects('success');
                })
                .catch(err => {
                    console.log(err.response.data);
                    setSeveritySubjects('error');
                });

        }
    };

    const onChangeFrom = (event) => {
        console.log(event.target.value);
        setTimeslotFrom(event.target.value);
        setTimeslotTo(timeslotTo);
        setDisabledTimeslot(false);
        //check if there is an empty value and if yes disable sumbit button
        if (event.target.value.substring(0, 2) === '' || event.target.value.substring(3, 5) === '') {
            setDisabledTimeslot(true);
        }
        let newTimeslotStart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), event.target.value.substring(0, 2), event.target.value.substring(3, 5));
        let newTimeslotEnd = new moment(newTimeslotStart).add(1, 'h').toDate();
        //check if hours, minutes <= 9 and if yes - append 0 in front
        if (newTimeslotEnd.getHours() <= 9 && newTimeslotEnd.getMinutes() > 9) {
            setTimeslotTo(`0${newTimeslotEnd.getHours()}:${newTimeslotEnd.getMinutes()}`);
        } else if (newTimeslotEnd.getHours() > 9 && newTimeslotEnd.getMinutes() <= 9) {
            setTimeslotTo(`${newTimeslotEnd.getHours()}:0${newTimeslotEnd.getMinutes()}`);
        } else if (newTimeslotEnd.getHours() <= 9 && newTimeslotEnd.getMinutes() <= 9) {
            setTimeslotTo(`0${newTimeslotEnd.getHours()}:0${newTimeslotEnd.getMinutes()}`);
        } else {
            setTimeslotTo(`${newTimeslotEnd.getHours()}:${newTimeslotEnd.getMinutes()}`);
        }
    };

    const addTimeslot = (values, { resetForm }) => {
        const timePreferenceIncluded = timePreferences.some(timePreference =>
            timePreference.day === values.day && (timePreference.startTime.hours === timeslotFrom.substring(0, 2)
                || (timePreference.startTime.hours === timeslotTo.substring(0, 2) && timePreference.endTime.minutes !== timeslotFrom.substring(3, 5)))
        );
        if (timePreferenceIncluded) {
            setShowWarningIncluded(true);
            resetForm({ values: values });
            console.log('Included time pref')
        } else {
            console.log('Not included time pref')
            setShowWarningIncluded(false);
            console.log(values);
            setDisabledTimeslot(true);
            setToken(window.localStorage.getItem('jwtToken'));
            console.log(timeslotFrom);
            console.log(timeslotTo);
            if (window.localStorage.getItem('jwtToken') !== null) {
                const headers = {
                    Authorization: `Bearer ${token.slice(10, -2)}`
                }
                console.log(headers)
                axios
                    .post(`http://localhost:5000/profile/addTimeslot`,
                        {
                            day: values.day,
                            startTime: {
                                hours: timeslotFrom.substring(0, 2),
                                minutes: timeslotFrom.substring(3, 5),
                            },
                            endTime: {
                                hours: timeslotTo.substring(0, 2),
                                minutes: timeslotTo.substring(3, 5),
                            },
                        },
                        {
                            headers: headers
                        })
                    .then(() => {
                        console.log('Timeslot added successfully!');
                        setSeverityTimeslots('success');
                        //window.location.reload();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                        setSeverityTimeslots('Error');
                    });
            }
        }
    };

    const handleOpenSnackbarSubjects = () => {
        setOpenSnackbarSubjects(true);
    };

    const handleCloseSnackbarSubjects = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbarSubjects(false);

        if (severitySubjects === 'success') {
            setSeveritySubjects('');
            window.location.reload(true);
        } else {
            setSeveritySubjects('');
            window.location.reload(true);
        }
    };

    const renderSwitchForSnackbarSubjects = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbarSubjects} autoHideDuration={1500} onClose={handleCloseSnackbarSubjects}>
                    <Alert onClose={handleCloseSnackbarSubjects} severity='success'>
                        Subject added!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbarSubjects} autoHideDuration={1500} onClose={handleCloseSnackbarSubjects}>
                    <Alert onClose={handleCloseSnackbarSubjects} severity='error'>
                        Couldn't add the selected subject. Try again!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    const handleOpenSnackbarTimeslots = () => {
        setOpenSnackbarTimeslots(true);
    };

    const handleCloseSnackbarTimeslots = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbarTimeslots(false);

        if (severityTimeslots === 'success') {
            setSeverityTimeslots('');
            window.location.reload(true);
        } else {
            setSeverityTimeslots('');
            window.location.reload(true);
        }
    };

    const renderSwitchForSnackbarTimeslots = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbarTimeslots} autoHideDuration={1500} onClose={handleCloseSnackbarTimeslots}>
                    <Alert onClose={handleCloseSnackbarTimeslots} severity='success'>
                        Timeslot added!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbarTimeslots} autoHideDuration={1500} onClose={handleCloseSnackbarTimeslots}>
                    <Alert onClose={handleCloseSnackbarTimeslots} severity='error'>
                        Couldn't add the timeslot. Try again!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    if (profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt) {
        return (
            <div className={classesProfile.container} style={{ paddingTop: '0px' }}>
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
                                                    <h2 style={{ color: 'slategrey', marginLeft: '73px' }}>I want to teach:</h2>
                                                    <div style={{ marginTop: '20px' }}>
                                                        {
                                                            profile.subjectsToTeach !== undefined ?
                                                                profile.subjectsToTeach.map((subject, index) => (
                                                                    <SubjectToTeach classesField={classesField} key={index} subject={subject} />
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
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Button classes={classesButton} style={{ marginTop: '0px' }} disabled={!(formik.isValid && formik.dirty) || disabled}
                                                            type="submit" color="primary" variant='outlined' onClick={handleOpenSnackbarSubjects}>
                                                            Add subject
                                                    </Button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                </Formik>
                                {
                                    renderSwitchForSnackbarSubjects(severitySubjects)
                                }
                            </div>
                            : <span>Subjects loading...</span>
                    }
                    <Divider style={{ marginTop: '20px' }} />
                    {
                        <div>
                            <Formik
                                initialValues={initialValuesTimeslot}
                                validationSchema={validationSchemaTimeslot}
                                onSubmit={addTimeslot}>
                                {
                                    formik => (
                                        <Form>
                                            <div>
                                                <h2 style={{ color: 'slategrey', textAlign: 'center' }}>Add time preferences for your tutorials:</h2>
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    name="day"
                                                    label="Day"
                                                    select
                                                    variant="outlined"
                                                    helperText="Please select one of the options"
                                                    classes={classesSelect}
                                                >
                                                    {days.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                                <div className={classesTimeslot.root}>
                                                    <TextFieldNormal
                                                        id="timeFrom"
                                                        name="timeFrom"
                                                        label="From"
                                                        type="time"
                                                        className={classesTimePicker.textField}
                                                        onChange={onChangeFrom}
                                                        value={timeslotFrom}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 300 // 5 min
                                                        }}
                                                    />

                                                    <TextFieldNormal
                                                        id="timeTo"
                                                        name="timeTo"
                                                        label="To"
                                                        type="time"
                                                        className={classesTimePicker.textField}
                                                        disabled={true}
                                                        value={timeslotTo}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            step: 300, // 5 min
                                                            min: { timeslotFrom }
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                    <Button classes={classesButton} style={{ marginTop: '0px' }} disabled={!(formik.isValid && formik.dirty) || disabledTimeslot}
                                                        type="submit" color="primary" variant='outlined' onClick={handleOpenSnackbarTimeslots}>
                                                        Add time preference
                                                    </Button>
                                                </div>
                                                {showWarningIncluded ?
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ color: 'red' }}>Overlapping time preference. Please choose another date/time.</p>
                                                    </div> : null}
                                                <div style={{ marginTop: '20px' }}>
                                                    <h2 style={{ color: 'slategrey', textAlign: 'center' }}>Your time preferences:</h2>
                                                    {
                                                        timePreferences.length > 0 ?
                                                            timePreferences.map((timePreference, index) => (
                                                                <TimePreference key={index} timePreference={timePreference} />
                                                            )) : null
                                                    }
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                            </Formik>
                            {
                                renderSwitchForSnackbarTimeslots(severityTimeslots)
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={classesProfile.container} style={{ paddingTop: '0px' }}>
                <h2 style={{ color: 'slategrey', marginLeft: '73px' }}>I want to teach:</h2>
                Currently, you don't offer help in any subjects. Let's change that! Upload Certificate of Enrolment and Grade Excerpt to become a tutor!
            </div>
        )
    }

}

export default ProfileTutorSubjects
