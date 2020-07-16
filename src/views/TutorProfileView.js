import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';

const useStylesTutor = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        padding: '1em'
    },
    content: {
        backgroundColor: 'white',
        padding: '0.5em'
    },
    grid: {
        flexGrow: '1'
    },
    rating: {
        display: 'flex'
    },
    test: {
        fontWeight: 'bold'
    }
}));

const useStylesFavourites = makeStyles(() => ({
    add: {
        color: 'red',
    }
}));

function TutorProfileView(props) {
    const [tutor, setTutor] = useState({});
    const tutorId = props.match.params.tutorId;
    const subjectId = props.match.params.subjectId;
    const [loading, setLoading] = useState(true);
    const classesTutor = useStylesTutor();
    const classesFavourites = useStylesFavourites();
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [tutorIsInFavourites, setTutorIsInFavourites] = useState(false);

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
            axios
                .get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        setTutorIsInFavourites(res.data.favouriteTutors?.some(tutor => tutor._id === tutorId));
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, tutorIsInFavourites]);

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

    const addRemoveFavourite = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        console.log(`Tutor in favourites ${tutorIsInFavourites}`)
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            console.log(tutor._id);
            if (!tutorIsInFavourites) {
                console.log('Add tutor to favourites');
                axios
                    .put(`http://localhost:5000/profile/addToFavourites`,
                        { tutorId: tutorId },
                        {
                            headers: {
                                Authorization: `Bearer ${token.slice(10, -2)}`
                            }
                        })
                    .then(res => {
                        console.log(res.data);
                        setTutorIsInFavourites(true);
                        //window.location.reload(true);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
            } else {
                console.log("Remove tutor from favourites");
                axios
                    .put(`http://localhost:5000/profile/removeFromFavourites`,
                        { tutorId: tutorId },
                        {
                            headers: {
                                Authorization: `Bearer ${token.slice(10, -2)}`
                            }
                        })
                    .then(res => {
                        console.log(res.data);
                        setTutorIsInFavourites(false);
                        //window.location.reload(true);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
            }
        }
    }

    const redirectToLogin = () => {
        props.history.push('/auth/login')
    }

    if (UserService.isAuthenticated()) {
        if (!loading) {
            return (
                <div className={classesTutor.container}>
                    <div className={classesTutor.content}>
                        <div className={classesTutor.grid}>
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
                                                <div className={classesTutor.rating}>
                                                    {
                                                        tutor.avgRating !== undefined ?
                                                            <div>
                                                                <Rating value={Number(tutor.avgRating)} precision={0.5} readOnly />
                                                                <Typography component="legend">{Number(tutor.avgRating).toFixed(1)}</Typography>
                                                            </div> : <div>No rating available</div>
                                                    }

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
                                            <div style={{ textAlign: 'right' }}>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {tutor.pricePerHour} € / hour
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    Languages: {tutor.languages?.join(", ")}
                                                </Typography>
                                            </div>
                                            <Grid item xs={12}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Tooltip title={tutorIsInFavourites ? 'Remove tutor from favourites' : 'Add tutor to favourites'} aria-label={tutorIsInFavourites ? 'remove-favourites' : 'add-favourites'}>
                                                        <IconButton className={tutorIsInFavourites ? classesFavourites.add : ''} onClick={addRemoveFavourite} aria-label="add to favorites">
                                                            <FavoriteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Button variant="contained" color="primary" component={Link} to={`/tutors/${subjectId}/booking/${tutorId}`}>
                                                        Book
                                                </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {tutor.personalStatement !== undefined ? tutor.personalStatement : <i>No description</i>}
                                    </Typography>
                                </Grid>

                            </Grid>
                        </div>
                        {tutor.feedback !== undefined ? tutor.feedback.map((feedback) => (
                            <div key={feedback._id}>
                                <hr />
                                <div className={classesTutor.rating}>
                                    <Rating value={feedback.rating} readOnly />
                                    <Typography component="legend">{feedback.rating}</Typography>
                                </div>
                                <Typography variant="body2" color="textPrimary" component="p">For Subject: {feedback.forSubject?.name}</Typography>
                                <Typography variant="body2" color="textSecondary" component="p">{feedback.comment}</Typography>
                            </div>
                        )) : null}
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
                    redirectToLogin()
                }
            </div>
        )
    }

}

export default TutorProfileView