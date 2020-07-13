import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SchoolSharpIcon from '@material-ui/icons/SchoolSharp';
import EventBusySharpIcon from '@material-ui/icons/EventBusySharp';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import GroupSharpIcon from '@material-ui/icons/GroupSharp';
import EuroSharpIcon from '@material-ui/icons/EuroSharp';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'
import Rating from '@material-ui/lab/Rating';
import styles from '../views/bookTutor.module.css';
import Typography from '@material-ui/core/Typography';




function TrendingTutors(props) {
    const [tutors, setTutors] = useState([]);
    const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
    

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
      <List>
        {
             tutors.map(tutor =>  {return <ListItem>{tutor.firstname} {tutor.avgRating}</ListItem>} )
        }
      </List>)

}

export default TrendingTutors
