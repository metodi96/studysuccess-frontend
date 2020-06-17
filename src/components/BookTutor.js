import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const initialValues = {
    timeslotStart: '',
    timeslotEnd: '',
    participantNumber: 1
}

// define the validation object schema
const validationSchema = Yup.object({
    timeslotStart: Yup.date().required('This field is obligatory'),
    timeslotEnd: Yup.date().required('This field is obligatory'),
})

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

function BookTutor({ tutor }) {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [disabled, setDisabled] = useState(true);

    const handleTimeslotChange = (event) => {
        setSelectedTimeslot(event.target.value);
    };
    const classesBox = useStyles();
    const classesDatePicker = useStylesDatePicker();
    const classesButton = useStylesButton();

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const onSubmit = values => {
        axios.post('http://localhost:5000/bookings/add', values)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(`Something went wrong ${err}`);
            })
    }

    return (
        <div>
            <Box classes={classesBox}>
                <div style={{ padding: 20 }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
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
                                    <FormLabel component="legend" style={{margin: 'auto'}}>Available at:</FormLabel>
                                    <RadioGroup aria-label="timePreferences" name="timePreferences" value={selectedTimeslot} onChange={handleTimeslotChange}>
                                        {
                                            tutor.timePreferences.map((timePreference, index, timePreferences) => {
                                                if (timePreference.day === selectedDate.day()) {
                                                    return <div key={index}>
                                                        <FormControlLabel value={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`} control={<Radio />} label={`${timePreference.startTime.hours}:${timePreference.startTime.minutes}-${timePreference.endTime.hours}:${timePreference.endTime.minutes}`} />
                                                    </div>
                                                } else if (index === timePreferences.length - 1 && timePreference.day !== selectedDate.day()) {
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
            </Box>
        </div>
    )
}

export default BookTutor
