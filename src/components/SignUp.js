import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Select } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { Button, MenuItem } from '@material-ui/core';

const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    university: ''
}

// define the validation object schema
const validationSchema = Yup.object({
    firstname: Yup.string().required('This field is obligatory'),
    lastname: Yup.string().required('This field is obligatory'),
    email: Yup.string().email('Invalid email format').required('This field is obligatory'),
    password: Yup.string().required('This field is obligatory'),
    university: Yup.string().required('This field is obligatory')
})

const useStylesField = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
        },
        '& input:hover': {
            backgroundColor: 'white !important',
        },
        marginRight: '50px',
        marginBottom: '10px',
        minWidth: '430px'
    }
}));

const useStylesSelect = makeStyles(() => ({
    root: {
        '& .MuiSelect-select.MuiSelect-select': {
            backgroundColor: 'white !important',
        },
        marginRight: '50px',
        marginBottom: '10px',
        minWidth: '430px'
    }
}));

const useStylesForm = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
    }
}));

const useStylesHeading = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex'
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        justifyContent: 'center',
        display: 'flex',
        maxHeight: '300px',
        color: 'white'
    }
}));

function SignUp({universities}) {

    const classesField = useStylesField();
    const classesForm = useStylesForm();
    const classesButton = useStylesButton();
    const classesHeading = useStylesHeading();
    const classesSelect = useStylesSelect();
    const [disabled, setDisabled] = useState(false);

    const onSubmit = values => {
        setDisabled(true);
        axios.post('http://localhost:5000/signup', values)
            .then(res => console.log(res.data))
            .catch(err => {
                //use this to precisely tell what the response from the server is
                console.log('response: ', err.response.data);
            });
    }
    //console.log('Errors', formik.errors)  console.log('Visited fields', formik.touched)

    return (
        <div style={{marginTop: '100px'}}>
            <div className={classesHeading.root}>
                <h3>Please fill in the form below to register.</h3>
            </div>
            <div className={classesForm.root}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}>
                    <Form>
                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='text'
                                variant='outlined'
                                id='firstname'
                                name='firstname'
                                label='First name'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='text'
                                variant='outlined'
                                id='lastname'
                                name='lastname'
                                label='Last name'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                variant='outlined'
                                type='email'
                                id='email'
                                name='email'
                                label='Email'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                variant='outlined'
                                type='password'
                                id='password'
                                name='password'
                                label='Password'
                            />
                        </div>

                        <div>

                            <Field
                                component={TextField}
                                type="text"
                                name="university"
                                label="University"
                                select
                                variant="outlined"
                                helperText="Please select one of the options"
                                classes={classesSelect}
                            >
                                {universities.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field>
                        </div>

                        <div className={classesButton.root}>
                            <Button
                                size="large"
                                disabled={disabled}
                                variant="outlined"
                                type="submit"
                            >Register</Button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default SignUp
