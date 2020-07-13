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
        .required("Required"),
    password: Yup.string()
        .required("No password provided.")
});

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

const useStylesButton = makeStyles(() => ({
    root: {
        maxHeight: '100px',
        color: 'white'
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
                <div className={classesButton.root}>
                    <Button
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
