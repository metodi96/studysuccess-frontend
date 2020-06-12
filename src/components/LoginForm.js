import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as EmailValidator from "email-validator";
import * as Yup from "yup";
import axios from 'axios'

const initialValues = {
    email: '',
    password: '',
}

const validationSchema=Yup.object({
    email: Yup.string()
        .email()
        .required("Required"),
    password: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number.")
}) 


function LoginForm(){

    const onSubmit = values => {
        axios.post('http://localhost:5000/login', values)
        .then(res => console.log(res.data))
        .catch(err => {
            console.log(`Something went wrong ${err}`);
        })
    }

    return(
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

export default LoginForm;
