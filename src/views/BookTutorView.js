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
import BookTutor from '../components/BookTutor';

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

const useStylesCard = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        minWidth: 345,
        maxHeight: 500,
        marginLeft: '50px'
    }
}));

function BookTutorView(props) {
    const [tutor, setTutor] = useState({});
    const [tutorId, setTutorId] = useState('5edcb20be565ab3ed0219746');
    const [subjectId, setSubjectId] = useState('5ed74fdba2d395112c5f6353');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    //dummy value - to be replaced with real one when the tutor has rating
    const avgRating = 4.7;
    const classesCard = useStylesCard();
    const classesTutor = useStylesTutor();

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        setTutorId('5edcb20be565ab3ed0219746');
        setSubjectId('5ed74fdba2d395112c5f6353')
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token)
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

    const redirect = () => {
        props.history.push('/')
    }
    if (UserService.isAuthenticated()) {
        if (!loading) {
            return (
                <div className={classesTutor.container}>
                    <Card className={classesCard.root}>
                        <CardHeader
                            title={`${tutor.firstname} ${tutor.lastname}`}
                            subheader={
                                <div className={classesTutor.rating}>
                                    <Rating name="read-only" value={avgRating} precision={0.5} readOnly />
                                    <Typography component="legend">{avgRating}</Typography>
                                </div>
                            }
                        />
                        <div style={{ justifyContent: 'center', display: 'flex' }}>
                            <img width='250px' height='250px' src={`http://localhost:5000/${tutor.userImage}`} alt={`${tutor.firstname} ${tutor.lastname}`} title={`${tutor.firstname} ${tutor.lastname}`} />
                        </div>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Tutor for {
                                    Object.values(tutor.subjectsToTeach).map((value, i) => (
                                        <span key={i}>{tutor.subjectsToTeach.length - 1 === i ? <b>{`${value.name}.`}</b> : <b>{`${value.name}, `}</b>}</span>
                                    ))
                                }
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton disabled aria-label="add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton disabled aria-label="share">
                                <ShareIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                    <div className={classesTutor.availability}>
                        <h2>Book an online lesson</h2>
                        <BookTutor tutor={tutor} subjectId={subjectId} />
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

export default BookTutorView
