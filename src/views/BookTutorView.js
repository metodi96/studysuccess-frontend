import React, { useState, useEffect } from 'react'
import UserService from '../services/UserService'
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import styles from './bookTutor.module.css'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '96.25%', // 16:9,

    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

function BookTutorView(props) {
    const [tutor, setTutor] = useState({});
    const [tutorId, setTutorId] = useState('5edcb20be565ab3ed0219746');
    const [subjectId, setSubjectId] = useState('5ed74fdba2d395112c5f6353');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    //dummy value - to be replaced with real one when the tutor has rating
    const avgRating = 4.7;
    const classes = useStyles();

    useEffect(() => {
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
                    console.log(res.data);
                    setTutor(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [token, tutorId, subjectId]);

    const redirect = () => {
        props.history.push('/')
    }
    if (UserService.isAuthenticated()) {
        if (!loading) {
            return (
                <div>
                    <Card className={classes.root}>
                        <CardHeader
                            title={`${tutor.firstname} ${tutor.lastname}`}
                            subheader={
                                <div className={styles.rating}>
                                    <Rating name="read-only" value={avgRating} readOnly />
                                    <Typography component="legend">{avgRating}</Typography>
                                </div>
                            }
                        />
                        <CardMedia
                            className={classes.media}
                            image="http://localhost:5000/uploads/joseph.png"
                            title={`${tutor.firstname} ${tutor.lastname}`}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Tutor for {
                                    Object.values(tutor.subjectsToTeach).map((value, i) => (
                                        <span key={i}>{tutor.subjectsToTeach.length - 1 === i ? <b>{`${value.name}.`}</b> : <b>{`${value.name}, `}</b>}</span>
                                    ))}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
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
