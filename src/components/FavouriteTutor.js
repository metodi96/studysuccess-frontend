import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Tooltip, IconButton, Button } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import Rating from '@material-ui/lab/Rating';
import { Link } from 'react-router-dom';
import axios from 'axios';

const useStylesFavourites = makeStyles(() => ({
    add: {
        color: 'red',
    }
}));

function FavouriteTutor({ tutor, classesTutor }) {

    const classesFavourites = useStylesFavourites();
    const [tutorIsInFavourites, setTutorIsInFavourites] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));

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
                        { tutorId: tutor._id },
                        {
                            headers: {
                                Authorization: `Bearer ${token.slice(10, -2)}`
                            }
                        })
                    .then(res => {
                        console.log(res.data);
                        setTutorIsInFavourites(true);
                        window.location.reload();
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
                        window.location.reload();
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    })
            }
        }
    }

    return (
        <div className={classesTutor.container}>
            <div className={classesTutor.content}>
                <div className={classesTutor.grid}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <img width='190px' height='190px' src={`http://localhost:5000/${tutor.userImage}`} alt={`${tutor.firstname} ${tutor.lastname}`} title={`${tutor.firstname} ${tutor.lastname}`} />
                                </Grid>
                                <Grid item xs={3}>
                                    <div>
                                        <Typography variant="body2" color="textSecondary" component="p" id="tutorName">
                                            {`${tutor.firstname} ${tutor.lastname}`}
                                        </Typography>
                                        <div className={classesTutor.rating}>
                                            {
                                                tutor.avgRating !== undefined ?
                                                    <div style={{display: 'flex'}}>
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
                                            {
                                                tutor.subjectsToTeach !== undefined ?
                                                    <div>
                                                        <div>
                                                            <Button variant="outlined" style={{ marginBottom: '2%' }} endIcon={<DoubleArrowOutlinedIcon />} component={Link}
                                                                to={`/tutors/${tutor.subjectsToTeach[0]._id}/profiles/${tutor._id}`}>See full profile</Button>
                                                        </div>
                                                        <div>
                                                            <Button variant="outlined" style={{ marginBottom: '2%' }} endIcon={<DoubleArrowOutlinedIcon />} component={Link} to={`/tutors/${tutor.subjectsToTeach[0]._id}/booking/${tutor._id}`}>
                                                                Show availability
                                                                </Button>
                                                        </div>
                                                    </div> : null
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {tutor.personalStatement !== undefined ? <b>{tutor.personalStatement}</b> : <i>No description</i>}
                            </Typography>
                        </Grid>

                    </Grid>
                </div>
            </div>

        </div>
    )
}

export default FavouriteTutor
