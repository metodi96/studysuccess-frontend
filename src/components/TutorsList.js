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
import { MenuItem, FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'flex',
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(4),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    listItem: {
        display: 'block',
        width: theme.spacing(120),
        backgroundColor: theme.palette.background.paper,
        borderRadius: '20px'
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
        marginLeft: '10%',
        marginRight: '8%'
    },
    pricePerHour: {
        fontSize: 'normal',
        fontWeight: 400,
        lineHeight: '1.5em',
        letterSpacing: '0.00938em',
        marginRight: '3%',
        marginTop: '1%',
    },
    tutorInfo: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '90%',
    }
}));

function TutorsList(props) {
    const classes = useStyles();
    const [sortMethod, setSortMethod] = useState(1);
    const { tutorsForSubject, setTutorsForSubject } = useContext(TutorsContext);
    const handleChangeSortMethod = (event) => {
        setSortMethod(event.target.value);
        if (event.target.value == 1) {

            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return a.avgRating - b.avgRating }));
        }
        else if (event.target.value == 2) {
            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return a.pricePerHour - b.pricePerHour }));
        }
        else if (event.target.value == 3) {
            setTutorsForSubject(tutorsForSubject.sort((a, b) => { return b.pricePerHour - a.pricePerHour }));
        }
    }

    useEffect(() => {
        let isMounted = true;
        axios.post(`http://localhost:5000/tutors/${props.subjectId}/filtered`)
            .then(res => {
                if (isMounted) {
                    console.log(res.data);
                    setTutorsForSubject(res.data);
                    //setTutorsForSubject(res.data.sort((a, b) => {return a.avgRating - b.avgRating} ));  
                }
            })
            .catch(err => {
                console.log(err);
            })
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, [])
    if (tutorsForSubject.length > 0) {
        return (
            <Box style={{ borderRadius: '4px' }} bgcolor="rgba(152, 158, 157, 0.438)" width="80%" py={2} pl={3}>
                <Box pl={2} display='flex'>
                    <Box mr="60%">{tutorsForSubject.length} tutor(s) match(es) your search</Box>
                    <Box>
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
                                <Box style={{ borderRadius: '4px' }} bgcolor="white" width="80%" className={classes.listItem}>
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
                                    <Box style={{ display: "flex" }}>
                                        <div className={classes.tutorDescription}>
                                            {tutor.personalStatement !== undefined ? tutor.personalStatement : <i>No description</i>}
                                        </div>
                                        <Button variant="outlined" style={{ marginBottom: '2%' }} endIcon={<DoubleArrowOutlinedIcon />} component={Link}
                                            to={`/tutors/${props.subjectId}/profiles/${tutor._id}`}>See full profile</Button>
                                    </Box>
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
                0 tutors match your search
            </Box>
        )
    }
}

export default TutorsList;