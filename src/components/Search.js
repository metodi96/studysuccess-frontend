import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    inputRoot: {
        width: 500,
        height: 40,
        borderRadius: 10,
        color: "black",
        backgroundColor: "#f2f2f2",
        "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: "grey"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: "grey"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: "grey"
        }
    }
}));

function Search() {
    const [subjects, setSubjects] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [subjectId, setSubjectId] = useState({});
    const classes = useStyles();

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                if (isMounted) {
                    setSubjects(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
    }, []);

    const handleSearchInput = event => {
        setDisabled(true);
        subjects.forEach(subject => {
            if (subject.name === event.target.value) {
                setDisabled(false);
                setSubjectId(subject._id);
            }
        });
    }

    const handleAutocomplete = (event, value) => {
        setDisabled(true);
        subjects.forEach(subject => {
            if (subject.name === value) {
                setDisabled(false);
                setSubjectId(subject._id);
            }
        });
    }

    return (
        <div>
            <Autocomplete
                size='small'
                onChange={handleAutocomplete}
                fullWidth={false}
                disableClearable
                forcePopupIcon={false}
                classes={classes}
                options={subjects.map((subject) => subject.name)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        onChange={handleSearchInput}
                        InputProps={{
                            ...params.InputProps, type: 'search',
                            endAdornment: (
                                <IconButton disabled={disabled}
                                    size='small'
                                    component={Link}
                                    to={`/tutors/${subjectId}`}
                                    aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            )
                        }}
                    />
                )}
            />


        </div>
    )
}

export default Search
