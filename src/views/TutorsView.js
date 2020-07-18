import React, { useState } from 'react'
import Filters from '../components/Filters'
import TutorsList from '../components/TutorsList'
import { TutorsContext } from '../components/TutorsContext'
import Search from '../components/Search'
import Box from '@material-ui/core/Box';


function TutorsView({ match }) {
    const [tutorsForSubject, setTutorsForSubject] = useState([]);
    return (
        <Box>
            <div style={{marginLeft: '1%'}}>
                <Search subjectIdParam={match.params.subjectId}></Search>
            </div>
            <Box style={{ display: "flex", minWidth: '1280px' }} mt="1%">
                <TutorsContext.Provider value={{ tutorsForSubject, setTutorsForSubject }}>
                    <Filters subjectId={match.params.subjectId}></Filters>
                    <TutorsList subjectId={match.params.subjectId}></TutorsList>
                </TutorsContext.Provider>
            </Box>
        </Box>
    )
}
export default TutorsView