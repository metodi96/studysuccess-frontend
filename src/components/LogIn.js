import React from "react";
import { Formik, Form, Field } from 'formik'
import * as Yup from "yup";
import axios from 'axios'

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
})


function LogIn(props) {

    const onSubmit = values => {
        axios.post('http://localhost:5000/login', values)
            .then(result => { 
                localStorage.setItem('jwtToken', JSON.stringify({
                    token: result.data.token
                }))
                if(props.location.pathname !== '/') {
                    props.history.push('/');
                }
                else {
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(`Something went wrong ${err}`);
            })
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <Form>
                <div className='form-control'>
                    <label htmlFor='email'></label>
                    <Field
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Email'
                    />
                </div>

                <div className='form-control'>
                    <label htmlFor='password'></label>
                    <Field
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Password'
                    />
                </div>
                <button type='submit'>Login</button>
            </Form>
        </Formik>
    )
}

export default LogIn;
