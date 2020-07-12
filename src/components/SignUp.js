import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

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
            border: '1px solid black',
            backgroundColor: 'white !important',
            padding: '5px 5px 5px 5px',
            borderRadius: '4px',
            height: '30px'
        },
        '& input:hover': {
            border: '1px solid black',
            backgroundColor: 'white !important',
        },
        marginRight: '50px',
        marginBottom: '10px'
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

function SignUp() {

    const classesField = useStylesField();
    const classesForm = useStylesForm();
    const classesButton = useStylesButton();
    const classesHeading = useStylesHeading();
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
                                id='firstname'
                                name='firstname'
                                placeholder='First name'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='text'
                                id='lastname'
                                name='lastname'
                                placeholder='Last name'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='email'
                                id='email'
                                name='email'
                                placeholder='Email'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='password'
                                id='password'
                                name='password'
                                placeholder='Password'
                            />
                        </div>

                        <div>
                            <Field
                                component={TextField}
                                classes={classesField}
                                type='text'
                                id='university'
                                name='university'
                                placeholder='University'
                            />
                        </div>

                        <div className={classesButton.root}>
                            <Button
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
