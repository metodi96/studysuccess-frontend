import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import styles from './tutorProfile.module.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";

function TutorProfileView(props) {
    const [tutor, setTutor] = useState({});
    const [tutorId, setTutorId] = useState(props.match.params.tutorId);
    const [subjectId, setSubjectId] = useState(props.match.params.subjectId);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    //dummy value - to be replaced with real one when the tutor has rating
    const avgRating = 4.7;

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            console.log(tutorId)
            console.log(subjectId)
            axios
                .get(`http://localhost:5000/tutors/${subjectId}/${tutorId}`, {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        console.log(res.data);
                        setTutor(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, tutorId, subjectId]);
    
    const addFavourite = () => {
        console.log("add favourite")
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            console.log(tutor._id);
            axios
                .put(`http://localhost:5000/profile/addToFavourites`, 
                {tutorId: tutorId  },
                {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    console.log(res.data);
                    window.location.reload(true);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    const redirect = () => {
        props.history.push('/')
    }  

    if (UserService.isAuthenticated()) {
        if (!loading) {
            return (
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={3}>
                                            <img width='250px' height='250px' src={`http://localhost:5000/${tutor.userImage}`} alt={`${tutor.firstname} ${tutor.lastname}`} title={`${tutor.firstname} ${tutor.lastname}`} />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div>
                                                <Typography variant="body2" color="textSecondary" component="p" id="tutorName">
                                                    {`${tutor.firstname} ${tutor.lastname}`}
                                                </Typography>
                                                <div className={styles.rating}>
                                                    <Rating value={tutor.avgRating} precision={0.5} readOnly />
                                                    <Typography component="legend">{tutor.avgRating}</Typography>
                                                </div>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    Tutor for {
                                                        Object.values(tutor.subjectsToTeach).map((value, i) => (
                                                            <span key={i}>{tutor.subjectsToTeach.length - 1 === i ? <b>{`${value.name}.`}</b> : <b>{`${value.name}, `}</b>}</span>
                                                        ))
                                                    }
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div style={{ textAlign: 'right'}}>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {tutor.pricePerHour} € / hour
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    Languages: {tutor.languages.join(", ")}
                                                </Typography>
                                            </div>
                                        <Grid item xs={12}>
                                            <div style={{ textAlign: 'right'}}>
                                                <IconButton onClick={addFavourite} aria-label="add to favorites">
                                                    <FavoriteIcon />
                                                </IconButton>
                                                 <Button variant="contained" color="primary" component={Link}  to={`/tutors/${subjectId}/booking/${tutorId}`}>
                                                        Book
                                                </Button>
                                             </div>
                                        </Grid>    
                                        </Grid>     
                                    </Grid>                 
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary" component="p">Please add the description in the backend, read it and present it here.</Typography>
                                </Grid>
                                
                            </Grid>
                        </div>
                        {/* { bookings.map((booking) => (<div key={booking._id} className={styles.booking}><PastBooking booking={booking} /></div>)) } */}
                        { tutor.feedback.map((feedback) => (
                            <div key = {feedback._id}>
                                <hr />
                                <div className={styles.rating}>
                                    <Rating value={feedback.rating} readOnly />
                                    <Typography component="legend">{feedback.rating}</Typography>
                                </div>
                                <Typography variant="body2" color="textPrimary" component="p">For Subject: {feedback.forSubject?.name}</Typography>
                                <Typography variant="body2" color="textSecondary" component="p">{feedback.comment}</Typography>
                            </div>
                        )) }
                    </div>

                </div>

                
            )
        } else {
            return (
                <div>
                    <p>Loading tutor...</p>
                </div>
            )
        }
    } else {
        return (
            <div>
                {
                    redirect()
                }
            </div>
        )
    }

}

export default TutorProfileView