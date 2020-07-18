import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, Typography, CardActions, Tooltip, IconButton, Avatar, CardContent, Button } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';
import axios from 'axios';
import UserService from '../services/UserService';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import { Link } from 'react-router-dom';

const useStylesCard = makeStyles(() => ({
    root: {
        maxWidth: 270,
        minWidth: 270,
        maxHeight: 270,
        marginLeft: '50px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

const useStylesTutor = makeStyles(() => ({
    rating: {
        display: 'flex'
    },
    container: {
        display: 'flex',
        marginTop: '50px'
    },
    availability: {
        marginLeft: '200px'
    }
}));

const useStylesFavourites = makeStyles(() => ({
    add: {
        color: 'red',
    }
}));

function TrendingTutor({ tutor }) {

    const [profile, setProfile] = useState(undefined);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [tutorIsInFavourites, setTutorIsInFavourites] = useState(false);
    const classesCard = useStylesCard();
    const classesTutor = useStylesTutor();
    const classesFavourites = useStylesFavourites();

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null && UserService.isAuthenticated()) {
            console.log(token)
            axios
                .get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token.slice(10, -2)}`
                    }
                })
                .then(res => {
                    if (isMounted) {
                        setProfile(res.data);
                        setTutorIsInFavourites(res.data.favouriteTutors?.some(element => element._id === tutor._id))
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token]);

    const addRemoveFavourite = () => {
        setToken(window.localStorage.getItem('jwtToken'));
        console.log(`Tutor in favourites ${tutorIsInFavourites}`)
        if (window.localStorage.getItem('jwtToken') !== null) {
            if (!tutorIsInFavourites) {
                console.log('Add tutor to favourites');
                axios
                    .put(`http://localhost:5000/profile/addToFavourites`,
                        { tutorId: tutor._id },
                        {
                            headers: {
                                Authorization: `Bearer ${token.slice(10, -2)}`
                            }
                        })
                    .then(res => {
                        console.log(res.data);
                        setTutorIsInFavourites(true);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
            } else {
                console.log("Remove tutor from favourites");
                axios
                    .put(`http://localhost:5000/profile/removeFromFavourites`,
                        { tutorId: tutor._id },
                        {
                            headers: {
                                Authorization: `Bearer ${token.slice(10, -2)}`
                            }
                        })
                    .then(res => {
                        console.log(res.data);
                        setTutorIsInFavourites(false);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
            }
        }
    }


    return (
        <div className={classesTutor.container}>
            <Card className={classesCard.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="tutor-image" src={`http://localhost:5000/${tutor.userImage}`}></Avatar>
                    }
                    title={`${tutor.firstname} ${tutor.lastname}`}
                    subheader={
                        <div className={classesTutor.rating}>
                            {tutor.avgRating !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Rating name="read-only" value={tutor.avgRating} precision={0.5} readOnly />
                                    <Typography component="legend">{tutor.avgRating.toFixed(1)}</Typography>
                                </div> : <div>No reviews yet.</div>
                            }
                        </div>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" style={{ minHeight: '100px' }}>
                        Tutor for {
                            tutor.subjectsToTeach !== undefined ?
                                tutor.subjectsToTeach.map((value, i) => (
                                    <span key={i}>{tutor.subjectsToTeach.length - 1 === i ? <b>{`${value.name}.`}</b> : <b>{`${value.name}, `}</b>}</span>
                                )) : '0 subjects'
                        }
                    </Typography>
                </CardContent>
                {
                    profile !== undefined ?
                        <CardActions disableSpacing>
                            <Tooltip title={tutorIsInFavourites ? 'Remove tutor from favourites' : 'Add tutor to favourites'} aria-label={tutorIsInFavourites ? 'remove-favourites' : 'add-favourites'}>
                                <IconButton className={tutorIsInFavourites ? classesFavourites.add : ''} onClick={addRemoveFavourite} aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                            </Tooltip>
                            <Button variant="outlined" style={{ marginBottom: '2%', left: '10%' }} endIcon={<DoubleArrowOutlinedIcon />} component={Link}
                                to={`/tutors/${tutor.subjectsToTeach[0]._id}/profiles/${tutor._id}`}>See full profile</Button>
                        </CardActions> : null
                }

            </Card>
        </div>
    )
}

export default TrendingTutor
