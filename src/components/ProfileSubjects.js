import React, { useState, useEffect } from 'react';
import SubjectToTakeLessonsIn from './SubjectToTakeLessonsIn';
import { MenuItem, Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

function ProfileSubjects({ classesProfile, classesSelect, profile, classesField, classesButton }) {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

    const initialValues = {
        subject: subjects[0] || ''
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        subject: Yup.string().required('You have to choose a subject'),
    })

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                if (isMounted) {
                    const allSubjects = res.data;
                    const profileSubjects = profile.subjectsToTakeLessonsIn;
                    console.log(allSubjects);
                    console.log(profileSubjects);
                    setSubjects(allSubjects.filter(function (subject) {
                        return !profileSubjects.find(function (subjectProfile) {
                            return subject._id === subjectProfile._id
                        })
                    }));
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
            });
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, []);

    const addSubject = (values) => {
        console.log(values);
        setDisabled(true);
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios
                .put(`http://localhost:5000/profile/addSubjectToTakeLessonsIn`,
                    { subjectId: values.subject },
                    {
                        headers: headers
                    })
                .then(() => {
                    console.log('Subject added successfully.');
                    //window.location.reload();
                })
                .catch(err => {
                    console.log(err.response.data);
                });

        }
    }

    return (
        <div className={classesProfile.container}>
            {
                profile.subjectsToTakeLessonsIn !== undefined ?
                    profile.subjectsToTakeLessonsIn.map(subject => (
                        <SubjectToTakeLessonsIn classesField={classesField} key={subject._id} subject={subject} />
                    )) : null
            }
            <div>
                {
                    !loading ?
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={addSubject}>
                            {
                                formik => (
                                    <Form>
                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="subject"
                                            label="Subject"
                                            select
                                            variant="outlined"
                                            helperText="Please select one of the options"
                                            classes={classesSelect}
                                        >
                                            {subjects.map(option => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                        <Button classes={classesButton} disabled={!(formik.isValid && formik.dirty) || disabled}
                                            type="submit" color="primary" variant='outlined'>
                                            Add subject
                                        </Button>
                                    </Form>
                                )}
                        </Formik>
                        : <span>Subjects loading...</span>
                }
            </div>
        </div>
    )
}

export default ProfileSubjects
