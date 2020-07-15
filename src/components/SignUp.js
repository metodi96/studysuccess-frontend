import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Checkbox } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { Button, MenuItem, FormControl, FormGroup, FormControlLabel, FormHelperText } from '@material-ui/core';

const useStylesContainer = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginTop: '25px',
        paddingBottom: '25px'
    }
}));

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

const useStylesEmailNotExists = makeStyles(() => ({
    root: {
        display: 'none'
    }
}));

const useStylesEmailExists = makeStyles(() => ({
    root: {
        color: 'red',
        textAlign: 'center'
    }
}));

const useStylesTerms = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));


function SignUp({ universities }) {

    const classesField = useStylesField();
    const classesForm = useStylesForm();
    const classesButton = useStylesButton();
    const classesHeading = useStylesHeading();
    const classesSelect = useStylesSelect();
    const classesContainer = useStylesContainer();
    const classesTerms = useStylesTerms();
    const [disabled, setDisabled] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const classesEmailNotExists = useStylesEmailNotExists();
    const classesEmailExists = useStylesEmailExists();

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        university: '',
        terms: false
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        firstname: Yup.string().required('This field is obligatory'),
        lastname: Yup.string().required('This field is obligatory'),
        email: Yup.string().email('Invalid email format').required('This field is obligatory'),
        password: Yup.string().required('This field is obligatory'),
        university: Yup.string().required('This field is obligatory'),
        terms: Yup.boolean(true).required("You need to agree to the terms.").oneOf([true], "Error")
    })

    const onSubmit = (values, { resetForm }) => {
        setDisabled(true);
        axios.post('http://localhost:5000/signup', values)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                //use this to precisely tell what the response from the server is
                console.log('response: ', err.response.data);
                resetForm({ values: values });
                if (err.response.status === 409) {
                    setEmailExists(true);
                }
            });
    }
    //console.log('Errors', formik.errors)  console.log('Visited fields', formik.touched)

    return (
        <div className={classesContainer.container}>
            <div className={classesHeading.root}>
                <h3>Please fill in the form below to register.</h3>
            </div>
            <div className={classesForm.root}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {
                        formik => (
                            <Form>
                                <div>
                                    <Field
                                        component={TextField}
                                        classes={classesField}
                                        type='text'
                                        variant='outlined'
                                        id='firstname'
                                        name='firstname'
                                        label='First name*'
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
                                        label='Last name*'
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
                                        label='Email*'
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
                                        label='Password*'
                                    />
                                </div>

                                <div>

                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="university"
                                        label="University*"
                                        select
                                        variant="outlined"
                                        classes={classesSelect}
                                    >
                                        {universities.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </div>

                                <div>
                                    <FormControl required component="fieldset" className={classesTerms.formControl}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Field
                                                    id="terms"
                                                    name="terms"
                                                    type="checkbox"
                                                    component={Checkbox}
                                                />}
                                                label="I agree to the terms and conditions.*"
                                            />
                                            {formik.getFieldMeta('terms').error ? <FormHelperText error style={{textAlign: 'center'}}>You need to agree to the terms and conditions.</FormHelperText> : null}
                                        </FormGroup>
                                    </FormControl>
                                </div>
                                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                                    <i style={{ fontSize: '0.85rem'}}>Required fields are marked with *.</i>
                                </div>                    
                                <div className={classesButton.root}>
                                    <Button
                                        size="large"
                                        disabled={disabled}
                                        variant="outlined"
                                        type="submit"
                                    >Register</Button>
                                </div>
                                <p className={emailExists ? classesEmailExists.root : classesEmailNotExists.root}>The email address was already registered.</p>
                            </Form>
                        )
                    }

                </Formik>
            </div>
        </div>
    )
}

export default SignUp
