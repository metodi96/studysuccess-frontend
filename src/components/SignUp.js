import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'
import axios from 'axios'

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

function SignUpForm() {
    
    const onSubmit = values => {
            axios.post('http://localhost:5000/signup', values)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(`Something went wrong ${err}`);
            })
    }
  //console.log('Errors', formik.errors)  console.log('Visited fields', formik.touched)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <Form>
                <div className='form-control'>
                <label htmlFor='firstname'></label> 
                <Field 
                type='text' 
                id='firstname' 
                name='firstname' 
                placeholder='First name'
                />
                <ErrorMessage name='firstname' component={TextError} />
                </div>

                <div className='form-control'>
                <label htmlFor='lastname'></label>
                <Field 
                type='text' 
                id='lastname' 
                name='lastname' 
                placeholder='Last name'
                />
                <ErrorMessage name='lastname' component={TextError} />
                </div>

                <div className='form-control'>
                <label htmlFor='email'></label>
                <Field 
                type='email' 
                id='email' 
                name='email' 
                placeholder='Email'
                />
                <ErrorMessage name='email'>
                    {errorMsg => <div className='error'>{errorMsg}</div>}                    
                </ErrorMessage>                           
                </div>

                <div className='form-control'>
                <label htmlFor='password'></label>
                <Field 
                type='password' 
                id='password' 
                name='password' 
                placeholder='Password'
                />
                <ErrorMessage name='password'>
                    {errorMsg => <div className='error'>{errorMsg}</div>}                    
                </ErrorMessage>                           
                </div>

                <div className='form-control'>
                <label htmlFor='university'></label>
                <Field 
                type='text' 
                id='university' 
                name='university' 
                placeholder='University'
                />
                <ErrorMessage name='university' component={TextError} />
                </div>

                <button type='submit'>Submit</button>
            </Form>    
        </Formik>
    )
}

export default SignUpForm
