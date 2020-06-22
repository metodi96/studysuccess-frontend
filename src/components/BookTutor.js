import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { Formik, Form } from 'formik';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStylesBox = makeStyles(() => ({
    root: {
        maxWidth: 1200,
        maxHeight: 500,
        borderRadius: '5px',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginBottom: '5px'
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
    }
}));



function BookTutor({ tutor, subjectId }) {
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
    const classesBox = useStylesBox();
    const classesDatePicker = useStylesDatePicker();
    const classesButton = useStylesButton();

    const initialValues = {
        timeslotStart: '',
        timeslotEnd: '',
        participantNumber: 1,
        tutor: tutor._id,
        subject: subjectId
    }

    useEffect(() => {
        axios.get(`http://localhost:5000/tutors/${tutor._id}/timePreferences`)
            .then(res => {
                if (res.status === 200) {
                    setTimePreferences(res.data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(`Something went wrong with getting time preferences ${err}`);
            })
    }, [tutor._id])

    const handleTimeslotChange = (event) => {
        setDisabled(false);
        setSelectedTimeslot(event.target.value);
        if (event.target.value !== undefined && event.target.name !== undefined) {
            setTimePreferenceId(event.target.name);
            setTimeslotStart(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(0, 2), event.target.value.substring(3, 5)))
            setTimeslotEnd(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(6, 8), event.target.value.substring(9, 11)))
        }
    };

    const handleDateChange = (date) => {
        setDisabled(true);
        if (!loading) {
            setSelectedDate(date);
            setWeek(date.week());
        }
    };

    const onSubmit = values => {
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
                    participantNumber: values.participantNumber,
                    tutor: tutor._id,
                    subject: subjectId,
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
                        window.location = res.data.forwardLink;
                    }
                })
                .catch(err => {
                    console.log(`Something went wrong with payment ${err}`);
                })
        }
    }

    return (
        <div>
            {
                !loading ?
                    <Formik
                        initialValues={initialValues}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={onSubmit}>
                        <Form>
                            <Box classes={classesBox}>
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
                                                style={{ display: '-webkit-inline-box' }}
                                            >
                                                {
                                                    timePreferences.map((timePreference, index) => {
                                                        if (timePreference.day === selectedDate.day() && !timePreference.bookedOnWeeks.includes(selectedDate.week())) {
                                                            return <div key={index}>
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
                                            </RadioGroup>
                                        </FormControl>
                                    </div>

                                </div>
                            </Box>
                            <Box classes={classesBox}>
                                <div className={classesButton.root}>
                                    <Button
                                        disabled={disabled}
                                        variant="outlined"
                                        type="submit"
                                    >Book tutorial</Button>
                                </div>
                            </Box>
                        </Form>
                    </Formik> :
                    <p>Loading form...</p>
            }

        </div>
    )
}

export default BookTutor
