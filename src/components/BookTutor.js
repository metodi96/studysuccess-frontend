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
        width: 800,
        height: 500,
        border: '1px solid black',
        borderRadius: '10px',
        backgroundColor: 'white',
        justifyContent: 'center'
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
        display: 'flex'
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
        console.log(event.target.value)
        if (event.target.value !== null) {
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
        setToken(window.localStorage.getItem('jwtToken'));
        console.log(selectedDate.date())
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            axios.post('http://localhost:5000/bookings/add',
                {
                    timeslotStart: timeslotStart,
                    timeslotEnd: timeslotEnd,
                    participantNumber: values.participantNumber,
                    tutor: tutor._id,
                    subject: subjectId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => console.log(res.data))
                .catch(err => {
                    console.log(timeslotStart)
                    console.log(timeslotEnd)
                    console.log(`Something went wrong ${err}`);
                })
        }
    }

    return (
        <div>
            {
                !loading ?
                    <Box classes={classesBox}>
                        <div style={{ padding: 20 }}>
                            <Formik
                                initialValues={initialValues}
                                validateOnBlur={false}
                                validateOnChange={false}
                                onSubmit={onSubmit}>
                                <Form>
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
                                                        else if (index === timePreferences.length - 1 && (timePreference.day !== selectedDate.day() || timePreference === null) && disabled && !thereIsRadio) {
                                                            console.log(timePreference.day)
                                                            console.log(selectedDate.day())
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
                                    <div className={classesButton.root}>
                                        <Button
                                            disabled={disabled}
                                            variant="outlined"
                                            type="submit"
                                        >Book tutorial</Button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </Box> :
                    <p>Loading form...</p>
            }

        </div>
    )
}

export default BookTutor
