import React, { useState, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Rating from '@material-ui/lab/Rating';
import { TutorsContext } from './TutorsContext';
import { SortMethodContext } from './SortMethodContext'
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    content: {
        backgroundColor: 'white',
        padding: '0.5em',
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    },
    inline: {
        display: 'flex',
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginRight: theme.spacing(4),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    tutorDescription: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '60%',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: '1.5em',
        letterSpacing: '0.00938em',
        marginLeft: '7.6em',
        marginRight: '8%'
    },
    pricePerHour: {
        fontSize: 'normal',
        fontWeight: 400,
        lineHeight: '1.5em',
        letterSpacing: '0.00938em',
        marginRight: '0.5em',
        marginTop: '1%',
    },
    container: {
        backgroundColor: 'rgba(152, 158, 157, 0.438)',
        padding: '1em',
        margin: 'auto',
        minWidth: '60em',
        minHeight: '29em',
        maxWidth: '70em',
        borderRadius: '4px',
    }
}));

function TutorsList(props) {
    const classes = useStyles();
    const {sortMethod, setSortMethod} = useContext(SortMethodContext);
    const { tutorsForSubject, setTutorsForSubject } = useContext(TutorsContext);
    const handleChangeSortMethod = (event) => {
        setSortMethod(event.target.value);
        if (event.target.value === 1) {
            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return a.avgRating - b.avgRating }));
        }
        else if (event.target.value === 2) {
            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return a.pricePerHour - b.pricePerHour }));
        }
        else if (event.target.value === 3) {
            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return b.pricePerHour - a.pricePerHour }));
        }
    }

    useEffect(() => {
        let isMounted = true;
        axios.get(`http://localhost:5000/tutors/${props.subjectId}`)
            .then(res => {
                if (isMounted) {
                    setTutorsForSubject(res.data.sort((a, b) => {return a.avgRating - b.avgRating} ));  
                }
            })
            .catch(err => {
                console.log(err);
            })
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [])
    if (tutorsForSubject.length > 0) {
        return (
            <Box className={classes.container} style={{ borderRadius: '4px' }} bgcolor="rgba(152, 158, 157, 0.438)">
                <Box pl={2}  display='flex'>
                    <Box mr="60%">{tutorsForSubject.length} tutor(s) match(es) your search</Box>
                    <Box style={{paddingRight: '1em'}}>
                        <InputLabel id="sort-by-label">Sort by</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by"
                            value={sortMethod}
                            onChange={handleChangeSortMethod}
                            className={classes.languages}
                        >
                            <MenuItem value={1}>{"Average rating"}</MenuItem>
                            <MenuItem value={2}>{"Lowest price"}</MenuItem>
                            <MenuItem value={3}>{"Highest price"}</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <List className={classes.wrapperBox}>
                    {
                        tutorsForSubject.map(tutor => {
                            return <ListItem key={tutor._id}>
                                <Box style={{ borderRadius: '4px', margin: 'auto' }} bgcolor="white" width="80%" className={classes.content}>
                                    <Box className={classes.inline}>
                                        <ListItemAvatar>
                                            <Avatar alt={tutor.firstname} src={`http://localhost:5000/${tutor.userImage}`} className={classes.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${tutor.firstname} ${tutor.lastname}`}
                                            secondary={
                                                <React.Fragment>
                                                    {
                                                        tutor.avgRating !== undefined ?
                                                            <span style={{ display: 'flex' }}>
                                                                <Rating component={'span'} name="read-only" value={Number(tutor.avgRating)} precision={0.5} readOnly />
                                                                <Typography component={'span'}>{Number(tutor.avgRating?.toFixed(1))}</Typography>
                                                            </span> : <span style={{ display: 'flex' }}>No reviews yet.</span>
                                                    }
                                                </React.Fragment>
                                            }
                                        />
                                        <div className={classes.pricePerHour} style={{ textAlign: 'right' }}>
                                            <Typography variant="body2" component="p">
                                                {tutor.pricePerHour} € / hour
                                                </Typography>
                                            <Typography variant="body2" component="p">
                                                Languages: {tutor.languages?.join(", ")}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box style={{ display: 'flex'}}>
                                        <div className={classes.tutorDescription}>
                                            {tutor.personalStatement !== undefined ? tutor.personalStatement : <i>No description</i>}
                                        </div>              
                                    </Box>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button variant="outlined" style={{ marginBottom: '2%'}} endIcon={<DoubleArrowOutlinedIcon />} component={Link}
                                            to={`/tutors/${props.subjectId}/profiles/${tutor._id}`}>See full profile</Button>                                        
                                    </div>                                    
                                </Box>
                            </ListItem>
                        })
                    }
                </List>
            </Box>
        )
    }
    else {
        return (
            <Box bgcolor="rgba(152, 158, 157, 0.438)" width="80%" py={2} pl={3}>
                0 tutors match your search! Please refilter (if enabled) or search for another subject!
            </Box>
        )
    }
}

export default TutorsList;