import React, { useState } from "react";
import { Formik, Form, Field } from 'formik'
import * as Yup from "yup";
import axios from 'axios';
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const initialValues = {
    email: '',
    password: '',
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email()
        .required("Email required"),
    password: Yup.string()
        .required("No password provided.")
});

const useStylesField = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
        },
        '& input:hover': {
            backgroundColor: 'white !important',
        },
        marginRight: '50px',
        marginBottom: '10px'
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        maxHeight: '100px',
        color: 'white',
        justifyContent: 'center',
        marginLeft: '-33px'
    }
}));

function LogIn(props) {

    const classesField = useStylesField();
    const classesButton = useStylesButton();
    const [wrongEmailOrPassword, setWrongEmailOrPassword] = useState('');

    const onSubmit = (values, {resetForm}) => {
        axios.post('http://localhost:5000/login', values)
            .then(result => {
                localStorage.setItem('jwtToken', JSON.stringify({
                    token: result.data.token
                }))
                if (props.location.pathname !== '/') {
                    props.history.push('/');
                    window.location.reload();
                }
                else {
                    window.location.reload();
                }
            })
            .catch(err => {
                setWrongEmailOrPassword('Incorrect email and/or password!');
                resetForm({ values : values });
            })
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <Form>
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
                <div className={classesButton.root}>
                    <Button
                        size='large'
                        variant="outlined"
                        type="submit"
                    >Login</Button>
                </div>
                <div>
                    <p style={{color: 'red'}}>{wrongEmailOrPassword}</p>
                </div>
            </Form>
        </Formik>
    )
}

export default LogIn;
