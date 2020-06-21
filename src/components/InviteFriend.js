import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';


function InviteFriend({booking, classesAvatar, openInvitationAlert, setOpenInvitationAlert}) {

    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [invitations, setInvitations] = useState(null);
    const initialValues = {
        email: '',
    }

    // define the validation object schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format'),
    })

    const handleCloseInvitationAlert = () => {
        setOpenInvitationAlert(false);
    };

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            axios
                .get(`http://localhost:5000/bookings/current/${booking._id}/invitations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.slice(10, -2)}`
                        }
                    })
                .then(res => {
                    console.log(res.data);
                    setInvitations(res.data);
                })
                .catch(err => {
                    console.log('something went wrong')
                    console.log(err);
                })
        }
    }, [token, booking._id]);

    const inviteFriend = values => {
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(`Inviting friend with email ${values.email} now...`)
            const headers = {
                Authorization: `Bearer ${token.slice(10, -2)}`
            }
            if (booking._id !== undefined) {
                axios.post('http://localhost:5000/bookings/current/invite',
                    {
                        friendEmail: values.email,
                        bookingId: booking._id,
                    },
                    {
                        headers: headers
                    })
                    .then(res => {
                        handleCloseInvitationAlert();
                        window.location.reload(true);
                        console.log(res.data);
                    })
                    .catch(err => {
                        handleCloseInvitationAlert();
                        console.log(`Something went wrong with invitation: ${err}`);
                    })
            }
        }
    }


    return (
        <div>
            <Dialog
                open={openInvitationAlert}
                onClose={handleCloseInvitationAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Would you like to invite some friends to this tutorial?"}</DialogTitle>
                <DialogContent>
                    Invited are: {invitations !== null ? invitations.map(invitation => {
                    if (invitation.toUser.userImage) {
                        console.log(invitation.toUser.userImage)
                        return <div key={invitation._id}><Avatar alt={`${invitation.toUser.firstname} ${invitation.toUser.lastname}`} src={`http://localhost:5000/${invitation.toUser.userImage}`} />
                            <p>{`${invitation.toUser.firstname} ${invitation.toUser.lastname}`}</p></div>
                    } else {
                        console.log('we dont have it boys')
                        return <Avatar key={invitation._id} alt={`${invitation.toUser.firstname} ${invitation.toUser.lastname}`} classes={classesAvatar}>
                            <PersonOutlineSharpIcon color='primary' />
                        </Avatar>
                    }
                }) : <span>No friends for now are invited.</span>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInvitationAlert} color="primary" autoFocus>
                        No
                            </Button>
                    <Formik
                        initialValues={initialValues}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validationSchema={validationSchema}
                        onSubmit={inviteFriend}>
                        <Form>
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
                            <Button type="submit" color="primary">
                                Yes
                                    </Button>

                        </Form>
                    </Formik>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default InviteFriend
