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
        height:60,
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
    const [disabled, setDisabled] = useState(true)
    const classes = useStyles();

    useEffect(() => {
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                setSubjects(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    });

    const handleSearchInput = event => {
        subjects.map((subject) => subject.name).indexOf(event.target.value) >= 0 ? setDisabled(false) : setDisabled(true);
    }

    const handleAutocomplete = (event, value) => {
        subjects.map((subject) => subject.name).indexOf(value) >= 0 ? setDisabled(false) : setDisabled(true);
    }

    return (
        <div>
            <Autocomplete
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
                        InputProps={{ ...params.InputProps, type: 'search', 
                        endAdornment: (
                            <IconButton disabled={disabled} component={Link} to="/tutors" aria-label="search">
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
