import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'
import LogInView from './views/LogInView';
import CurrentBookingsView from './views/CurrentBookingsView';
import NavBar from './components/NavBar'
import BookTutorView from './views/BookTutorView';
import BookingAddSuccessView from './views/BookingAddSuccessView';

//import Navbar from './components/Navbar.js' <Navbar /> 

function App() {
    return (
      <div className='container'>    
        <NavBar />    
        <div className='routerContainer'>
        <Router>                 
          <br/>
          <Switch>
            <Route path='/'exact component={MainView} />
            <Route path='/auth/login' component={LogInView} />
            <Route path='/tutors/:subjectId' exact component={TutorsView} />
            <Route path='/tutors/:subjectId/:tutorId' exact component={BookTutorView} />
            <Route path='/bookings/current' component={CurrentBookingsView} />
            <Route path='/bookings/success' component={BookingAddSuccessView} />
            <Route path='*' component={MainView} />
          </Switch>          
        </Router>
        </div>
      </div>
    );
}

export default App;

