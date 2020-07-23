import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { Button, Typography, Snackbar, Tooltip, Divider, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import tips from '../images/tips.png'
import Alert from './Alert';

const useStylesBox = makeStyles(() => ({
    root: {
        maxWidth: 1200,
        maxHeight: 550,
        borderRadius: '4px',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginBottom: '5px',
        display: 'block',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

const useStylesBoxButtons = makeStyles(() => ({
    root: {
        maxWidth: 1200,
        maxHeight: 500,
        borderRadius: '4px',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginBottom: '5px',
        display: 'flex',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

const useStylesDatePicker = makeStyles(() => ({
    root: {
        '& input': {
            border: 'none',
            backgroundColor: 'white !important'
        },
        marginBottom: '20px'
    }
}));

const useStylesButton = makeStyles(() => ({
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

const useStylesSuggest = makeStyles((theme) => ({
    root: {
        marginTop: '25px',
        border: '1px solid darkgrey',
        padding: '10px 10px 10px 10px',
        position: 'relative',
        borderRadius: '4px'
    },
    rootBackup: {
        border: '1px solid darkgrey',
        padding: '10px 10px 10px 10px',
        position: 'relative',
        borderRadius: '4px'
    }
}));

const useStylesSelect = makeStyles(() => ({
    root: {
        '& .MuiSelect-select.MuiSelect-select': {
            backgroundColor: 'white !important',
            fontSize: '14px',
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px',
        marginLeft: '33px'
    }
}));

function BookTutor({ tutor, subjectId }) {
    const [loadingSubject, setLoadingSubject] = useState(true);
    const [timePreferences, setTimePreferences] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().add(1, 'days'));
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [timeslotStart, setTimeslotStart] = useState('');
    const [timeslotEnd, setTimeslotEnd] = useState('');
    const [loading, setLoading] = useState(true);
    const [week, setWeek] = useState(moment().week());
    const [timePreferenceId, setTimePreferenceId] = useState('');
    const [proposedTimeslotFrom, setProposedTimeslotFrom] = useState('');
    const [proposedTimeslotTo, setProposedTimeslotTo] = useState('');
    const [displayProposedTimeslots, setDisplayProposedTimeslots] = useState(false);
    const [proposeOptionChosen, setProposeOptionChosen] = useState(false);
    const [redirectToCurrentBookings, setRedirectToCurrentBookings] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [forwardLink, setForwardLink] = useState('');
    const [subjectIdSelected, setSubjectIdSelected] = useState(subjectId);
    const classesBox = useStylesBox();
    const classesBoxButtons = useStylesBoxButtons();
    const classesDatePicker = useStylesDatePicker();
    const classesButton = useStylesButton();
    const classesTimePicker = useStylesTimepicker();
    const classesSuggest = useStylesSuggest();
    const classesSelect = useStylesSelect();

    const initialValues = {
        timeFrom: proposedTimeslotFrom,
        timeTo: proposedTimeslotTo
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);

        if (severity === 'success') {
            setRedirectToCurrentBookings(true);
            setSeverity('');
        } else if (severity === 'successPaypal' && forwardLink !== '') {
            //we redirect to the forward link which is the approval url from the backend
            window.location = forwardLink;
            setSeverity('');
        } else if (severity === 'successPropose') {
            setRedirectToCurrentBookings(true);
            setSeverity('');
        } else {
            setSeverity('');
        }
    };

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        axios.get(`http://localhost:5000/tutors/${tutor._id}/timePreferences`)
            .then(res => {
                if (res.status === 200 && isMounted) {
                    setTimePreferences(res.data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(`Something went wrong with getting time preferences ${err}`);
            })
        axios.get(`http://localhost:5000/subjects/${subjectIdSelected}`)
            .then(res => {
                if (res.status === 200 && isMounted) {
                    setLoadingSubject(false);
                }
            })
            .catch(err => console.log(`Something went wrong with getting the subject from params: ${err.response.data}`))
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [tutor._id, subjectIdSelected])

    const onChangeFrom = (event) => {
        setProposedTimeslotFrom(event.target.value);
        setProposedTimeslotTo(proposedTimeslotTo);
        setDisabled(false);
        //check if there is an empty value and if yes disable sumbit button
        if (event.target.value.substring(0, 2) === '' || event.target.value.substring(3, 5) === '') {
            setDisabled(true);
        }
        let newTimeslotStart = new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(0, 2), event.target.value.substring(3, 5));
        setTimeslotStart(newTimeslotStart);
        let newTimeslotEnd = new moment(newTimeslotStart).add(1, 'h').toDate();
        setTimeslotEnd(newTimeslotEnd);
        //check if hours, minutes <= 9 and if yes - append 0 in front
        if (newTimeslotEnd.getHours() <= 9 && newTimeslotEnd.getMinutes() > 9) {
            setProposedTimeslotTo(`0${newTimeslotEnd.getHours()}:${newTimeslotEnd.getMinutes()}`);
        } else if (newTimeslotEnd.getHours() > 9 && newTimeslotEnd.getMinutes() <= 9) {
            setProposedTimeslotTo(`${newTimeslotEnd.getHours()}:0${newTimeslotEnd.getMinutes()}`);
        } else if (newTimeslotEnd.getHours() <= 9 && newTimeslotEnd.getMinutes() <= 9) {
            setProposedTimeslotTo(`0${newTimeslotEnd.getHours()}:0${newTimeslotEnd.getMinutes()}`);
        } else {
            setProposedTimeslotTo(`${newTimeslotEnd.getHours()}:${newTimeslotEnd.getMinutes()}`);
        }
        console.log(event.target.value);
        console.log(`${newTimeslotEnd.getHours()}:${newTimeslotEnd.getMinutes()}`);
    };
    /* not needed since we automatically calculate the proposed timeslot
    const onChangeTo = (event) => {
        setProposedTimeslotTo(event.target.value);
        setProposedTimeslotFrom(proposedTimeslotFrom);
        if (proposedTimeslotFrom.substring(0, 2) === '' || proposedTimeslotFrom.substring(3, 5) === ''
            ||
            event.target.value.substring(0, 2) === '' || event.target.value.substring(3, 5) === ''
        ) {
            setDisabled(true);
        }
        setTimeslotEnd(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(0, 2), event.target.value.substring(3, 5)));
        setDisabled(false);
        if (event.target.value.substring(0, 2) < proposedTimeslotFrom.substring(0, 2)
            || (event.target.value.substring(0, 2) === proposedTimeslotFrom.substring(0, 2)
                &&
                event.target.value.substring(3, 5) < proposedTimeslotFrom.substring(3, 5)
            )) {
            setDisabled(true);
        }
        console.log(event.target.value);
    };*/

    const handleTimeslotChange = (event) => {
        setProposeOptionChosen(false);
        setDisabled(false);
        setSelectedTimeslot(event.target.value);
        setDisplayProposedTimeslots(false);
        if (event.target.value !== undefined && event.target.name !== undefined && event.target.name !== 'proposeTime') {
            setTimePreferenceId(event.target.name);
            setTimeslotStart(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(0, 2), event.target.value.substring(3, 5)))
            setTimeslotEnd(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(6, 8), event.target.value.substring(9, 11)))
        } else if (event.target.name === 'proposeTime') {
            setProposeOptionChosen(true);
            setTimeslotStart('');
            setTimeslotEnd('');
            setProposedTimeslotFrom('');
            setProposedTimeslotTo('');
            setDisabled(true);
            setDisplayProposedTimeslots(true);
        }

    };

    const handleDateChange = (date) => {
        setDisabled(true);
        if (!loading) {
            setSelectedDate(date);
            setWeek(date.week());
        }
    };

    const onSubmitPropose = () => {
        console.log('Propose submit')
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios.post('http://localhost:5000/bookings/add',
                {
                    firstname: tutor.firstname,
                    lastname: tutor.lastname,
                    price: tutor.pricePerHour,
                    timeslotStart: timeslotStart,
                    timeslotEnd: timeslotEnd,
                    participantNumber: 1,
                    tutor: tutor._id,
                    subject: subjectIdSelected,
                },
                {
                    headers: headers
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        setSeverity('successPropose');
                        setOpenSnackbar(true);
                    }
                })
                .catch(err => {
                    setSeverity('error');
                    setOpenSnackbar(true);
                    console.log(`Something went wrong with payment ${err}`);
                })
        }
    }

    const onSubmit = () => {
        console.log('Normal submit')
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios.post('http://localhost:5000/bookings/pay',
                {
                    firstname: tutor.firstname,
                    lastname: tutor.lastname,
                    price: tutor.pricePerHour,
                    timeslotStart: timeslotStart,
                    timeslotEnd: timeslotEnd,
                    participantNumber: 1,
                    tutor: tutor._id,
                    subject: subjectIdSelected,
                    week: week,
                    timePreferenceId: timePreferenceId,
                },
                {
                    headers: headers,
                    maxRedirects: 0
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        setSeverity('successPaypal');
                        setOpenSnackbar(true);
                        //we set the forward link by getting it from the response
                        setForwardLink(res.data.forwardLink);
                    }
                })
                .catch(err => {
                    setSeverity('error')
                    setOpenSnackbar(true);
                    console.log(`Something went wrong with payment ${err}`);
                })
        }
    }

    const onSubmitBackup = () => {
        console.log('Backup submit')
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios.post('http://localhost:5000/bookings/payBackup',
                {
                    firstname: tutor.firstname,
                    lastname: tutor.lastname,
                    price: tutor.pricePerHour,
                    timeslotStart: timeslotStart,
                    timeslotEnd: timeslotEnd,
                    participantNumber: 1,
                    tutor: tutor._id,
                    subject: subjectIdSelected,
                    week: week,
                    timePreferenceId: timePreferenceId,
                },
                {
                    headers: headers
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        setSeverity('success');
                        setOpenSnackbar(true);
                    }
                })
                .catch(err => {
                    setSeverity('error')
                    setOpenSnackbar(true);
                    console.log(`Something went wrong with payment ${err}`);
                })
        }
    }

    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Tutorial was booked successfully!
                </Alert>
                </Snackbar>
            case 'successPaypal':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Redirecting to paypal to process payment...
                </Alert>
                </Snackbar>
            case 'successPropose':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Timeslot proposed successfully!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Couldn't book tutorial!
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    const handleSelectChange = event => {
        setSubjectIdSelected(event.target.value)
    }

    return (
        <div>
            {
                redirectToCurrentBookings ? <Redirect to='/bookings/current' /> : !loading ?
                    <Formik
                        initialValues={initialValues}
                        onSubmit={proposeOptionChosen ? onSubmitPropose : onSubmit}>
                        <Form>
                            <Box classes={classesBox}>
                                {
                                    !loadingSubject ?
                                        <div style={{ textAlign: 'center', paddingBottom: '20px', fontSize: '1.25rem' }}>
                                            <div style={{position: 'relative'}}><b style={{position: 'absolute', left: '20%', top: '18%'}}>Subject:</b> <Field
                                                component={TextField}
                                                type="text"
                                                name="subject"
                                                label="Subject"
                                                select
                                                variant="outlined"
                                                classes={classesSelect}
                                                onChange={handleSelectChange}
                                                value={subjectIdSelected}
                                            >
                                                {tutor.subjectsToTeach.map(option => (
                                                    <MenuItem key={option._id} value={option._id}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            </div>
                                        </div>
                                        : null
                                }
                                <Divider />
                                <div style={{ padding: 20 }}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <Grid container
                                            alignItems="center"
                                            justify="center">
                                            <KeyboardDatePicker
                                                disablePast
                                                classes={classesDatePicker}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Choose a date"
                                                format="DD.MM.YYYY"
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                minDate={new Date(moment().add(1, 'days'))}
                                                maxDate={new Date(moment().year(), 11, 31)}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    <div className={classesButton.root}>
                                        <br />
                                        <FormControl style={{ display: 'flex', justifyContent: 'center' }} component="fieldset">
                                            <FormLabel component="legend" style={{ margin: 'auto', marginBottom: '10px' }}>Available at:</FormLabel>
                                            <RadioGroup
                                                aria-label="timePreferences"
                                                name="timePreferences"
                                                value={selectedTimeslot}
                                                onChange={handleTimeslotChange}
                                                style={{ display: 'flex' }}
                                            >
                                                {
                                                    timePreferences.map((timePreference, index) => {
                                                        if (timePreference.day === selectedDate.day() && !timePreference.bookedOnWeeks.includes(selectedDate.week())) {
                                                            return <div key={index} style={{ margin: 'auto' }}>
                                                                <FormControlLabel
                                                                    name={timePreference._id}
                                                                    value={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`}
                                                                    control={<Radio />}
                                                                    label={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`}
                                                                />
                                                            </div>
                                                        }
                                                        return null;
                                                    })
                                                }
                                                <div className={timePreferences.length > 0 ? classesSuggest.root : classesSuggest.rootBackup}>
                                                    <Tooltip title='Tip' aria-label='tip'><img style={{ position: 'absolute', right: '-10%', top: '-35%' }} src={tips} alt='Tip' width='50px' height='50px' /></Tooltip>
                                                    <div>
                                                        <Typography style={{ fontSize: '1rem', textAlign: 'center' }}>These time slots don't work for you?</Typography>
                                                        <Typography style={{ fontSize: '1rem', textAlign: 'center' }}>Feel free to suggest another time slot to the tutor!</Typography>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <FormControlLabel
                                                            name="proposeTime"
                                                            value='Another timeslot'
                                                            control={<Radio />}
                                                            label='Suggest another timeslot'
                                                        />
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                            </Box>
                            {
                                displayProposedTimeslots ?
                                    <Box classes={classesBox}>
                                        <div className={classesButton.root}>
                                            <TextField
                                                id="timeFrom"
                                                name="timeFrom"
                                                label="From"
                                                type="time"
                                                className={classesTimePicker.textField}
                                                onChange={onChangeFrom}
                                                value={proposedTimeslotFrom}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300 // 5 min
                                                }}
                                            />

                                            <TextField
                                                id="timeTo"
                                                name="timeTo"
                                                label="To"
                                                type="time"
                                                className={classesTimePicker.textField}
                                                disabled={true}
                                                value={proposedTimeslotTo}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                    min: { proposedTimeslotFrom }
                                                }}
                                            />
                                        </div>
                                    </Box>
                                    :
                                    <div></div>
                            }
                            <Box classes={classesBoxButtons}>
                                <div className={classesButton.root}>
                                    <Button
                                        disabled={disabled}
                                        variant="outlined"
                                        type="submit"
                                    >{!proposeOptionChosen ? 'Book and pay tutorial' : 'Propose time'}</Button>
                                </div>
                                <div className={classesButton.root}>
                                    <Button
                                        disabled={disabled || proposeOptionChosen}
                                        variant="outlined"
                                        onClick={onSubmitBackup}
                                    >Book (without payment)</Button>
                                </div>
                            </Box>
                            <div>
                                {
                                    renderSwitchForSnackbar(severity)
                                }
                            </div>
                        </Form>
                    </Formik> :
                    <p>Loading form...</p>
            }

        </div>
    )
}

export default BookTutor
