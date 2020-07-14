import React, { useState } from 'react';
import * as Yup from 'yup';
import { TextField, SimpleFileUpload } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Avatar, MenuItem, Fab } from '@material-ui/core';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/AddAPhoto';
import Add from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from './Alert';

const useStylesField = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
        },
        '& input:hover': {
            backgroundColor: 'white !important',
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px'
    }
}));

const useStylesEmail = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px'
    }
}));

const useStylesButton = makeStyles(() => ({
    root: {
        float: 'left',
        marginRight: '10px'
    }
}));

const useStylesBooking = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: '1100px',
        marginBottom: '30px',
    }
}));

function PersonalInfo({ profile, universities, openProfileAlert, setOpenProfileAlert }) {
    const classesButton = useStylesButton();
    const classesField = useStylesField();
    const classesBooking = useStylesBooking();
    const [disabled, setDisabled] = useState(false);
    const [typeImageRight, setTypeImageRight] = useState(true);
    const [thumbnail, setThumbnail] = useState(null);
    const [typePdfCertificateRight, setTypePdfCertificateRight] = useState(true);
    const [typePdfGradeRight, setTypePdfGradeRight] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [selectedFile, setSelectedFile] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    //doesn't work super correctly
    const [hasCertificateOfEnrolment, setHasCertificateOfEnrolment] = useState(profile.hasCertificateOfEnrolment);
    const [hasGradeExcerpt, setHasGradeExcerpt] = useState(profile.hasGradeExcerpt);

    const initialValues = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        university: profile.university,
        studyProgram: profile.studyProgram,
        semester: profile.semester,
        degree: profile.degree,
        subjectsToTakeLessonsIn: profile.subjectsToTakeLessonsIn
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        firstname: Yup.string().required('This field is obligatory'),
        lastname: Yup.string().required('This field is obligatory'),
        email: Yup.string().email('Invalid email format').required('This field is obligatory'),
        university: Yup.string().required('This field is obligatory')
    })

    const fileSelectedHandler = (event) => {
        console.log(event.target.files[0]);
        // Allowed file type 
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (allowedExtensions.exec(event.target.files[0].name)) {
            setTypeImageRight(true);
            setSelectedFile(event.target.files[0]);
            let reader = new FileReader();

            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            //otherwise it doesnt get displayed
            reader.readAsDataURL(event.target.files[0]);
        } else if (!allowedExtensions.exec(event.target.files[0].name)) {
            setTypeImageRight(false);
        }
    }

    const fileSelectedHandlerCertificate = (event) => {
        console.log(event.target.files[0]);
        // Allowed file type 
        const allowedExtensions = /(\.pdf)$/i;

        if (allowedExtensions.exec(event.target.files[0].name)) {
            setTypePdfCertificateRight(true);
            setHasCertificateOfEnrolment(true);
        } else if (!allowedExtensions.exec(event.target.files[0].name)) {
            setTypePdfCertificateRight(false);
            setHasCertificateOfEnrolment(false);
        }
    }

    const fileSelectedHandlerGrade = (event) => {
        console.log(event.target.files[0]);
        // Allowed file type 
        const allowedExtensions = /(\.pdf)$/i;

        if (allowedExtensions.exec(event.target.files[0].name)) {
            setTypePdfGradeRight(true);
            setHasGradeExcerpt(true);

        } else if (!allowedExtensions.exec(event.target.files[0].name)) {
            setTypePdfGradeRight(true);
            setHasGradeExcerpt(false);
        }
    }

    const onSubmit = (values, { resetForm }) => {
        setToken(window.localStorage.getItem('jwtToken'));
        setDisabled(true);
        const formData = new FormData();
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("email", values.email);
        formData.append("university", values.university);
        formData.append("semester", values.semester);
        if (values.studyProgram !== '' && values.studyProgram !== undefined) {
            formData.append("studyProgram", values.studyProgram);
        }
        if (values.degree !== undefined) {
            formData.append("degree", values.degree);
        }
        if (selectedFile !== null) {
            formData.append('userImage', selectedFile, selectedFile.name);
        }
        if (values.hasCertificateOfEnrolment !== undefined) {
            formData.append('hasCertificateOfEnrolment', hasCertificateOfEnrolment);
        }
        if (values.hasGradeExcerpt !== undefined) {
            formData.append('hasGradeExcerpt', hasGradeExcerpt);
        }
        console.log(...formData);

        if (window.localStorage.getItem('jwtToken') !== null) {
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            console.log(headers)
            axios.put('http://localhost:5000/profile/update', formData,
                {
                    headers: headers
                }
            )
                .then(res => {
                    setDisabled(false);
                    resetForm({ values: values });
                    window.location.reload();
                    console.log(res.data)
                })
                .catch(err => {
                    resetForm({ values: values });
                    setDisabled(false)
                    console.log('response: ', err.response.data);
                });
        }
    }

    const handleCloseProfileAlert = () => {
        setOpenProfileAlert(false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
        setSeverity('');
        handleCloseProfileAlert();
        window.location.reload(true);
    };

    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Changes saved successfully!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Couldn't save the changes
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    return (
        <div className={classesBooking.container}>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {
                    formik => (
                        <Form>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='firstname'
                                    name='firstname'
                                    variant="outlined"
                                    label='First name'
                                    value={initialValues.firstname}

                                />
                                <div style={{ position: 'absolute', left: '20%', top: '12%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='lastname'
                                    name='lastname'
                                    variant="outlined"
                                    label='Last name'
                                    value={initialValues.lastname}
                                />
                                <div style={{ position: 'absolute', left: '20%', top: '12%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='email'
                                    name='email'
                                    variant="outlined"
                                    disabled
                                    value={initialValues.email}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    type="text"
                                    name="university"
                                    label="University"
                                    select
                                    variant="outlined"
                                    helperText="Please select one of the options"
                                    classes={classesField}
                                >
                                    {universities.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <div style={{ position: 'absolute', left: '20%', top: '11%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            { /*
                                profile.certificateOfEnrolment ? 
                                <div>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='studyProgram'
                                    id='studyProgram'
                                    name='studyProgram'
                                    value={initialValues.studyProgram}
                                />
                            </div>
                            : null
                            */
                            }
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='studyProgram'
                                    name='studyProgram'
                                    label='Study Program'
                                    variant="outlined"
                                    value={initialValues.studyProgram || ''}
                                />
                                <div style={{ position: 'absolute', left: '20%', top: '12%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='semester'
                                    name='semester'
                                    variant="outlined"
                                    label='Semester'
                                    value={initialValues.semester || ''}
                                />
                                <div style={{ position: 'absolute', left: '20%', top: '12%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='text'
                                    id='degree'
                                    name='degree'
                                    variant="outlined"
                                    label='Degree'
                                    value={initialValues.degree}
                                />
                                <div style={{ position: 'absolute', left: '20%', top: '12%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="userImage">
                                    <input style={{ display: "none" }} id="userImage" type="file" onChange={fileSelectedHandler} />
                                    <Fab
                                        color="primary"
                                        size="small"
                                        component="span"
                                        aria-label="add"
                                        variant="extended"
                                    >
                                        <AddIcon /><span style={{ paddingLeft: '5px' }}>Upload avatar</span>
                                    </Fab>
                                </label>
                                {thumbnail !== null ? <Avatar src={thumbnail} /> : null}
                                {!typeImageRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                            </div>

                            <div>
                                {
                                    !profile.hasCertificateOfEnrolment ? <div>
                                        <label htmlFor="certificate">
                                            <input style={{ display: "none" }} id="certificate" type="file" onChange={fileSelectedHandlerCertificate} />
                                            <Fab
                                                color="primary"
                                                size="small"
                                                component="span"
                                                aria-label="add"
                                                variant="extended"
                                            >
                                                <Add /><span style={{ paddingLeft: '5px' }}>Upload certificate of enrolment</span>
                                            </Fab>
                                        </label>
                                        {!typePdfCertificateRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                                    </div> : null
                                }

                            </div>

                            <div>
                                {
                                    !profile.hasGradeExcerpt ? <div>
                                        <label htmlFor="grade">
                                            <input style={{ display: "none" }} id="grade" type="file" onChange={fileSelectedHandlerGrade} />
                                            <Fab
                                                color="primary"
                                                size="small"
                                                component="span"
                                                aria-label="add"
                                                variant="extended"
                                            >
                                                <Add /><span style={{ paddingLeft: '5px' }}>Upload grade excerpt</span>
                                            </Fab>
                                        </label>
                                        {!typePdfGradeRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                                    </div> : null
                                }
                            </div>
                            <Button classes={classesButton} disabled={!formik.isValid || disabled || !typeImageRight || !typePdfCertificateRight || !typePdfGradeRight} type="submit" color="primary">
                                Save changes
                            </Button>
                        </Form>
                    )}
            </Formik>
            {
                profile.subjectsToTakeLessonsIn.map(subject => (<p key={subject._id}>{subject.name}</p>))
            }
            {
                renderSwitchForSnackbar(severity)
            }
        </div>
    )
}

export default PersonalInfo


/*
                            <div>
                                <Field
                                    component={TextField}
                                    classes={classesField}
                                    type='subjectsToTakeLessonsIn'
                                    id='subjectsToTakeLessonsIn'
                                    name='subjectsToTakeLessonsIn'
                                    value={initialValues.subjectsToTakeLessonsIn}
                                />
                            </div>

*/