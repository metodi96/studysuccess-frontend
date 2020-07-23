import React, { useState} from 'react';
import * as Yup from 'yup';
import { TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Avatar, MenuItem, Fab, InputLabel, Select, Input, Checkbox, FormControl, ListItemText } from '@material-ui/core';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/AddAPhoto';
import Add from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';

const useStylesEmail = makeStyles(() => ({
    root: {
        '& input': {
            backgroundColor: 'white !important',
            color: 'darkgrey !important'
        },
        marginBottom: '20px',
        marginRight: '-20px',
        minWidth: '250px',
        maxWidth: '250px',
        marginLeft: '33px'
    }
}));
    
const useStylesTextArea = makeStyles(() => ({
    root: {
        height: '150px',
        padding: '12px 20px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px',
        resize: 'vertical horizontal',
        fontFamily: '"Titillium Web", sans-serif',
        maxWidth: '300px',
        marginBottom: '30px',
        marginTop: '20px',
        marginLeft: '3%'
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function PersonalInfo({ profile, universities, studyPrograms, classesProfile, classesField, classesSelect, classesButton}) {

    const classesEmail = useStylesEmail();
    const classesTextArea = useStylesTextArea();
    const [disabled, setDisabled] = useState(false);
    const [typeImageRight, setTypeImageRight] = useState(true);
    const [thumbnail, setThumbnail] = useState(null);
    const [typePdfCertificateRight, setTypePdfCertificateRight] = useState(true);
    const [typePdfGradeRight, setTypePdfGradeRight] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileCertificate, setSelectedFileCertificate] = useState(null);
    const [selectedFileGrade, setSelectedFileGrade] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [hasCertificateOfEnrolment, setHasCertificateOfEnrolment] = useState(profile.hasCertificateOfEnrolment);
    const [hasGradeExcerpt, setHasGradeExcerpt] = useState(profile.hasGradeExcerpt);
    const [selectedLanguages, setSelectedLanguages] = useState(profile.languages || []);
    const languages = ['English', 'German', 'French', 'Italian', 'Russian', 'Chineese', 'Indian', 'Spanish'];

    const initialValues = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        university: profile.university,
        studyProgram: profile.studyProgram || '',
        semester: profile.semester || '',
        degree: profile.degree || '',
        subjectsToTakeLessonsIn: profile.subjectsToTakeLessonsIn,
        pricePerHour: profile.pricePerHour || '',
        personalStatement: profile.personalStatement || ''
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
            setSelectedFileCertificate(event.target.files[0]);
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
            setSelectedFileGrade(event.target.files[0]);

        } else if (!allowedExtensions.exec(event.target.files[0].name)) {
            setTypePdfGradeRight(false);
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
        if (values.semester !== undefined && values.semester !== '') {
            formData.append("semester", values.semester);
        }
        if (values.studyProgram !== '' && values.studyProgram !== undefined) {
            formData.append("studyProgram", values.studyProgram);
        }
        if (values.degree !== undefined && values.degree !== '') {
            formData.append("degree", values.degree);
        }
        if (selectedFile !== null) {
            formData.append('userImage', selectedFile, selectedFile.name);
        }
        if (selectedFileCertificate !== null) {
            formData.append('hasCertificateOfEnrolment', hasCertificateOfEnrolment);
        }
        if (selectedFileGrade !== null) {
            formData.append('hasGradeExcerpt', hasGradeExcerpt);
        }
        if (profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt) {
            if (values.pricePerHour !== undefined && values.pricePerHour !== '') {
                formData.append("pricePerHour", values.pricePerHour);
            }
            if (values.personalStatement !== undefined && values.personalStatement !== '') {
                formData.append("personalStatement", values.personalStatement);
            }
            if (selectedLanguages.length > 0) {
                for (let i = 0; i < selectedLanguages.length; i++) {
                    formData.append('languages[]', selectedLanguages[i]);
                }
            }
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
                    console.log("I am here");
                    console.log(res);
                    //setSelectedLanguages(res.languages);
                    setDisabled(false);
                    resetForm({ values: values });
                    setSeverity('success');
                    //console.log(res.data)
                })
                .catch(err => {
                    resetForm({ values: values });
                    setDisabled(false);
                    setSeverity('error');
                    console.log('response: ', err.response.data);
                });
        }
    }

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleChange = (event) => {
        setSelectedLanguages(event.target.value);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);

        if (severity === 'success') {
            setSeverity('');
            window.location.reload(true);
        } else {
            setSeverity('');
            window.location.reload(true);
        }
    };

    const renderSwitchForSnackbar = (severity) => {
        switch (severity) {
            case 'success':
                return <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='success'>
                        Changes saved successfully!
                </Alert>
                </Snackbar>
            case 'error':
                return <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity='error'>
                        Couldn't save the changes
                        </Alert>
                </Snackbar>
            default:
                return null
        }
    };

    return (
        <div className={classesProfile.container}>
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
                                />
                                <div style={{ position: 'absolute', left: '70%', top: '23%' }} >
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
                                />
                                <div style={{ position: 'absolute', left: '70%', top: '20%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div>
                                <Field
                                    component={TextField}
                                    classes={classesEmail}
                                    type='text'
                                    id='email'
                                    name='email'
                                    variant="outlined"
                                    disabled
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
                                    classes={classesSelect}
                                >
                                    {universities.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <div style={{ position: 'absolute', left: '67%', top: '15%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Field
                                    component={TextField}
                                    type="text"
                                    name="studyProgram"
                                    label="Study program"
                                    select
                                    variant="outlined"
                                    helperText="Please select one of the options"
                                    classes={classesSelect}
                                >
                                    {studyPrograms.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <div style={{ position: 'absolute', left: '67%', top: '17%' }} >
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
                                />
                                <div style={{ position: 'absolute', left: '70%', top: '20%' }} >
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
                                />
                                <div style={{ position: 'absolute', left: '70%', top: '20%' }} >
                                    <EditIcon />
                                </div>
                            </div>
                            {
                                profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt ? <div style={{ position: 'relative' }}>
                                    <Field
                                        component={TextField}
                                        classes={classesField}
                                        type='text'
                                        id='pricePerHour'
                                        name='pricePerHour'
                                        variant="outlined"
                                        label='Price per Hour'
                                    />
                                    <div style={{ position: 'absolute', left: '70%', top: '20%' }} >
                                        <EditIcon />
                                    </div>

                                </div>
                                    : null
                            }
                            {
                                profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt ?
                                    <FormControl style={{ maxWidth: '250px', minWidth: '250px', marginBottom: '5%', marginLeft: '10%' }}>
                                        <InputLabel id='languages-input-label'>Languages</InputLabel>
                                        <Select
                                            labelId='languages-input-label'
                                            id='languages-input-select'
                                            multiple
                                            value={selectedLanguages}
                                            onChange={handleChange}
                                            input={<Input />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {languages.map((language, index) => (
                                                <MenuItem key={index} value={language}>
                                                    <Checkbox checked={selectedLanguages.indexOf(language) > -1} />
                                                    <ListItemText primary={language} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> : null
                            }
                            {
                                profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt ?
                                    <FormControl style={{display: 'flex', justifyContent: 'center'}}>
                                        <Field
                                            className={classesTextArea.root}
                                            type='text'
                                            id='personalStatement'
                                            name='personalStatement'
                                            placeholder={`Enter personal description here...`}
                                            as="textarea"
                                            label='Personal Information'
                                        />
                                    </FormControl> : null
                            }

                            <div style={{ marginLeft: '73px', display: 'inline-block' }}>
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
                                    <span style={{ paddingTop: '5px', paddingLeft: '5px' }}>{selectedFile !== null ? selectedFile.name : ''}</span>
                                </label>
                                {thumbnail !== null ? <Avatar src={thumbnail} /> : null}
                                {!typeImageRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                            </div>

                            <div>
                                {
                                    !profile.hasCertificateOfEnrolment ? <div style={{ marginTop: '10px', marginRight: '5px' }}>
                                        <label htmlFor="certificate" style={{ display: 'block', textAlign: 'center' }}>
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
                                            <div>
                                                <span style={{ paddingTop: '5px', paddingLeft: '5px' }}>{selectedFileCertificate !== null ? selectedFileCertificate.name : ''}</span>
                                            </div>
                                        </label>
                                        {!typePdfCertificateRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                                    </div> : null
                                }

                            </div>

                            <div>
                                {
                                    !profile.hasGradeExcerpt ? <div style={{ marginBottom: '10px' }}>
                                        <label htmlFor="grade" style={{ display: 'block', textAlign: 'center', marginRight: '5px' }}>
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
                                            <div>
                                                <span style={{ paddingTop: '5px', paddingLeft: '5px' }}>{selectedFileGrade !== null ? selectedFileGrade.name : ''}</span>
                                            </div>
                                        </label>
                                        {!typePdfGradeRight ? <p style={{ color: 'red' }}>Wrong file type</p> : null}
                                    </div> : null
                                }
                            </div>
                            <div style={{ marginLeft: '53px' }}>
                                <Button classes={classesButton} disabled={!formik.isValid || disabled || !typeImageRight || !typePdfCertificateRight || !typePdfGradeRight}
                                    type="submit" color="primary" variant='outlined' onClick={handleOpenSnackbar}>
                                    Save changes
                                </Button>
                            </div>
                        </Form>
                    )}
            </Formik>
            {
                renderSwitchForSnackbar(severity)
            }

        </div>
    )
}

export default PersonalInfo