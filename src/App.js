import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './views/MainView';
import TutorsView from './views/TutorsView';
import SignUpView from './views/SignUpView';
import LogInView from './views/LogInView';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'
import CurrentBookingsView from './views/CurrentBookingsView';
import NavBar from './components/NavBar'
import BookTutorView from './views/BookTutorView';
import BookingAddSuccessView from './views/BookingAddSuccessView';
import PastBookingsView from './views/PastBookingsView';
import PendingBookingsView from './views/PendingBookingsView';
import BookingAcceptedSuccessView from './views/BookingAcceptedSuccessView';
import ManageProfileView from './views/ManageProfileView';
import UserService from './services/UserService';
import LogInView from './views/LogInView'

//import Navbar from './components/Navbar.js' <Navbar /> 

function App() {

  return (
    <Router>
      <NavBar />
      <div className='container'>
        <div className={UserService.isAuthenticated() !== false ? 'routerContainer' : ''}>
          <br />
          <Switch>
            <Route path='/' exact component={MainView} />
            <Route path='/auth/login' component={LogInView} />
            <Route path='/signup' component={SignUpView} />
            <Route path='/profile' component={ManageProfileView} />
            <Route path='/tutors/:subjectId' exact component={TutorsView} />
            <Route path='/tutors/:subjectId/:tutorId' exact component={BookTutorView} />
            <Route path='/bookings/current' component={CurrentBookingsView} />
            <Route path='/bookings/success' component={BookingAddSuccessView} />
            <Route path='/bookings/successAccepted' component={BookingAcceptedSuccessView} />
            <Route path='/bookings/past' component={PastBookingsView} />
            <Route path='/bookings/pending' component={PendingBookingsView} />
            <Route path='*' component={MainView} />
            <Route path='/tutors/:subjectId' component={TutorsView} />
          </Switch>          
        </div>
      </div>
    </Router>
  );
}

export default App;

