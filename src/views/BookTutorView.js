import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import BookTutor from '../components/BookTutor';
import person from '../images/person.png';

const useStylesTutor = makeStyles(() => ({
    rating: {
        display: 'flex'
    },
    container: {
        display: 'flex',
    },
}));

const useStylesBox = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '0%',
        marginBottom: '30px',
        padding: '25px 0px 25px 25px',
        maxWidth: '375px',
        minWidth: '375px',
        borderRadius: '4px',
        maxHeight: '500px',
        marginTop: '6%'
    }
}));

const useStylesBoxTwo = makeStyles(() => ({
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        marginLeft: '100px',
        marginBottom: '30px',
        padding: '25px 25px 25px 25px',
        maxWidth: '600px',
        minWidth: '600px',
        borderRadius: '4px'
    }
}));

const useStylesCard = makeStyles(() => ({
    root: {
        maxWidth: 345,
        minWidth: 345,
        maxHeight: 500,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

function BookTutorView(props) {
    const [tutor, setTutor] = useState({});
    const tutorId = props.match.params.tutorId;
    const subjectId = props.match.params.subjectId;
    const [loading, setLoading] = useState(true);
    const [tutorHasImage, setTutorHasImage] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const classesCard = useStylesCard();
    const classesTutor = useStylesTutor();
    const classesBox = useStylesBox();
    const classesBoxRight = useStylesBoxTwo();


    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
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
                        if (res.data.userImage !== undefined) {
                            axios
                                .get(`http://localhost:5000/${res.data.userImage}`)
                                .then(() => {
                                    setTutorHasImage(true);
                                    setLoading(false);
                                })
                                .catch(() => {
                                    setTutorHasImage(false);
                                    setLoading(false);
                                })
                        } else {
                            console.log('undefined')
                            setLoading(false);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [token, tutorId, subjectId]);

    if (!loading) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={classesBox.container}>
                        <div className={classesTutor.container}>
                            <Card className={classesCard.root}>
                                <CardHeader
                                    title={`${tutor.firstname} ${tutor.lastname}`}
                                    subheader={
                                        <div className={classesTutor.rating}>
                                            {
                                                tutor.avgRating !== undefined ?
                                                    <div style={{ display: 'flex' }}>
                                                        <Rating name="read-only" value={Number(tutor.avgRating)} precision={0.5} readOnly />
                                                        <Typography component="legend">{tutor.avgRating?.toFixed(1)}</Typography>
                                                    </div> : <div>Rating not available. No reviews.</div>
                                            }

                                        </div>
                                    }
                                />
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <img width='250px' height='250px' src={tutorHasImage ? `http://localhost:5000/${tutor.userImage}` : person} alt={`${tutor.firstname} ${tutor.lastname}`} title={`${tutor.firstname} ${tutor.lastname}`} />
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
                            </Card>
                        </div>
                    </div>
                    <div style={{ display: 'block' }}>
                        <div style={{marginLeft: '13%'}}>
                            <h2>Book an online lesson</h2>
                        </div>
                        <div className={classesTutor.availability}>
                            <div className={classesBoxRight.container}>
                                <BookTutor tutor={tutor} subjectId={subjectId} />
                            </div>
                        </div>
                    </div>
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
}

export default BookTutorView
