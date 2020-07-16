import React from 'react'
import LogIn from '../components/LogIn'

function LogInView(props) {
    //pass the path down the LogIn component so that it can get redirected to the main page after login
    return (
        <div style={{textAlign: 'center', height: '100vh'}}>
            <LogIn {...props} />
        </div>
    )
}

export default LogInView
