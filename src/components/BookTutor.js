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

const useStyles = makeStyles(() => ({
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
        }
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
        maxHeight: '300px'
    }
}));



function BookTutor({ tutor, subjectId }) {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [thereIsRadio, setThereIsRadio] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [timeslotStart, setTimeslotStart] = useState('');
    const [timeslotEnd, setTimeslotEnd] = useState('');
    const [loading, setLoading] = useState(true);

    const initialValues = {
        timeslotStart: '',
        timeslotEnd: '',
        participantNumber: 1,
        tutor: tutor._id,
        subject: subjectId
    }

    useEffect(() => {
        setLoading(false);
    }, [])

    const handleTimeslotChange = (event) => {
        setSelectedTimeslot(event.target.value);
        setDisabled(false);
    };

    const handleRadioClick = (event) => {
        setSelectedTimeslot(event.target.value);
        setDisabled(false);
        if (event.target.value !== undefined) {
            setTimeslotStart(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(0, 2), event.target.value.substring(3, 5)))
            setTimeslotEnd(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date(), event.target.value.substring(6, 8), event.target.value.substring(9, 11)))
        }
    }

    const classesBox = useStyles();
    const classesDatePicker = useStylesDatePicker();
    const classesButton = useStylesButton();

    const handleDateChange = (date) => {
        if (!loading) {
            setSelectedDate(date);
            setThereIsRadio(false);
            tutor.timePreferences.map((timePreference, index, timePreferences) => {
                if (timePreference.day !== date.day() && !disabled) {
                    setDisabled(true);
                } else if (index === timePreferences.length - 1 && date.day !== date.day() && !disabled) {
                    setDisabled(false);
                }
                else if (timePreference.day === date.day()) {
                    setThereIsRadio(true);
                    setDisabled(false);
                }
                return setDisabled(true);
            })
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
                },
                {
                    headers: headers,
                    maxRedirects: 0
                })
                .then(res => {
                    if (res.status === 200) {
                        console.log('WE PASSED THE FIRST REQUEST')
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
                                                maxDate={new Date(moment().year(), 11, 31)}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    <div className={classesButton.root}>
                                        <br />
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend" style={{ margin: 'auto' }}>Available at:</FormLabel>
                                            <RadioGroup
                                                aria-label="timePreferences"
                                                name="timePreferences"
                                                value={selectedTimeslot}
                                                onChange={handleTimeslotChange}
                                            >
                                                {
                                                    tutor.timePreferences.map((timePreference, index, timePreferences) => {
                                                        if (timePreference.day === selectedDate.day()) {
                                                            return <div key={index}>
                                                                <FormControlLabel
                                                                    name={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}${index}`}
                                                                    onClick={handleRadioClick}
                                                                    value={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`}
                                                                    control={<Radio />}
                                                                    label={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`}
                                                                />
                                                            </div>
                                                        }
                                                        //first condition to display message only once
                                                        else if (index === timePreferences.length - 1 && (timePreference.day !== selectedDate.day() || timePreference === null) && disabled && !thereIsRadio) {
                                                            return <div key={index}>
                                                                <p>Sorry, I am not available on the selected date, please choose another.</p>
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
