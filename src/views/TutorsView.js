import React, {useState} from 'react'
//import Filters from '../components/Filters'
//import React  from 'react'
//import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Filters from '../components/Filters'
import TutorsList from '../components/TutorsList'
import {TutorsContext} from '../components/TutorsContext'
import Search from '../components/Search'
import Box from '@material-ui/core/Box';


function TutorsView({match}) {
    const [tutorsForSubject, setTutorsForSubject] = useState([]);
        return (
            <Box>
                <Search></Search>
                <Box style={{display: "flex", minWidth: '1280px'}} mt="1%">
                    <TutorsContext.Provider value={{tutorsForSubject, setTutorsForSubject}}>
                        <Filters subjectId={match.params.subjectId}></Filters>
                        <TutorsList subjectId={match.params.subjectId}></TutorsList>
                    </TutorsContext.Provider>            
                </Box>
            </Box>
        )
}
export default TutorsView