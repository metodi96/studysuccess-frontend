import React, { useState } from 'react'
import Filters from '../components/Filters'
import TutorsList from '../components/TutorsList'
import { TutorsContext } from '../components/TutorsContext'
import { SortMethodContext } from '../components/SortMethodContext'
import Search from '../components/Search'
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import UserService from '../services/UserService'


function TutorsView({ match }) {
    const [tutorsForSubject, setTutorsForSubject] = useState([]);
    const [sortMethod, setSortMethod] = useState(1);
    return (
        <Box>
            <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ marginLeft: '1em' }}>
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
            <Box style={{ display: "flex"}} mt="1%" maxWidth = "70%">
                <TutorsContext.Provider value={{ tutorsForSubject, setTutorsForSubject }}>
                    <SortMethodContext.Provider value={{sortMethod, setSortMethod}}>
                        <Filters subjectId={match.params.subjectId}></Filters>
                        <TutorsList subjectId={match.params.subjectId}></TutorsList>
                    </SortMethodContext.Provider>                    
                </TutorsContext.Provider>
            </Box>
        </Box>
    )
}
export default TutorsView