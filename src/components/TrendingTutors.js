import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from '../views/bookTutor.module.css';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import UserService from '../services/UserService';


import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';

const useStylesCard = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        minWidth: 345,
        maxHeight: 500,
        marginLeft: '50px'
    }
}));


function TrendingTutors(props) {
    const [tutors, setTutors] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    const [tutorId, setTutorId] = useState('5edcb20be565ab3ed0219746');
    const [subjectId, setSubjectId] = useState('5ed74fdba2d395112c5f6353');
    const [loading, setLoading] = useState(true);
    const classesCard = useStylesCard();

    const addFavourite = () => {
        console.log("add favourite")
        setToken(window.localStorage.getItem('jwtToken'));
        if (window.localStorage.getItem('jwtToken') !== null) {
            console.log(token);
            
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

    useEffect(() => {
        setToken(window.localStorage.getItem('jwtToken'));
        axios.get('http://localhost:5000/tutors/')
            .then(res => {
                console.log(res.data);
                setTutors(res.data.sort((a, b) => {return a.avgRating - b.avgRating} )
                .slice(0,4)); 
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
  return(
      
            <div className={styles.container}>
                <Card className={classesCard.root}>
                    <CardHeader
                    title={`${tutors[0]?.firstname} ${tutors[0]?.lastname}`} 
                    subheader={
                        <div className={styles.rating}>
                            <Rating name="read-only" value={tutors[0]?.avgRating} precision={0.5} readOnly />
                            <Typography component="legend">{tutors[0]?.avgRating}</Typography>
                        </div>
                    }
                    />  
                        <CardActions disableSpacing>
                            <IconButton disabled aria-label="add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton disabled aria-label="share">
                                <ShareIcon />
                            </IconButton>
                        </CardActions>                 
                </Card> 
            
            
    </div>
       
    )

}

export default TrendingTutors
