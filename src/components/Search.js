import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        border: '1px solid grey',
        paddingLeft: '10px',
        borderRadius: '5px'
    },
    iconButton: {
        padding: 10,
    },
}));

function Search() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:5000/subjects")
            .then(res => {
                setSubjects(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    });

    return (
        <div>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={subjects.map((subject) => subject.name)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                )}
            />
        </div>
    )

    
}

export default Search
