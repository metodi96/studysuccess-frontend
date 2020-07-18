import React, { useState } from 'react'
import Filters from '../components/Filters'
import TutorsList from '../components/TutorsList'
import { TutorsContext } from '../components/TutorsContext'
import Search from '../components/Search'
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import UserService from '../services/UserService'


function TutorsView({ match }) {
    const [tutorsForSubject, setTutorsForSubject] = useState([]);
    return (
        <Box>
            <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ marginLeft: '1%' }}>
                    <Search subjectIdParam={match.params.subjectId}></Search>
                </div>
                {
                    !UserService.isAuthenticated() ? 
                    <div style={{ position: 'absolute', right: '2%', display: 'flex', top: '0%' }}>
                        <Button
                            variant="outlined"
                            component={Link}
                            to={'/auth/login'}>Login</Button>
                        <Button
                            style={{marginLeft: '20px'}}
                            variant="outlined"
                            component={Link}
                            to={'/'}>Sign Up</Button>
                    </div> : null
                }
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