import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import TutorsView from './views/TutorsView';
import MainView from './views/MainView'
import CurrentBookingsView from './views/CurrentBookingsView';
import NavBar from './components/NavBar'
import BookTutorView from './views/BookTutorView';
import BookingAddSuccessView from './views/BookingAddSuccessView';
import PastBookingsView from './views/PastBookingsView';
import PendingBookingsView from './views/PendingBookingsView';
import BookingAcceptedSuccessView from './views/BookingAcceptedSuccessView';
import TutorProfileView from './views/TutorProfileView';
import ManageProfileView from './views/ManageProfileView';
import UserService from './services/UserService';
import LogInView from './views/LogInView';
import axios from 'axios';

function App() {

  const [profile, setProfile] = useState(undefined);
  const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
  const universities = [
    {
      value: 'TUM',
      label: 'TUM',
    }
  ];


  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    setToken(window.localStorage.getItem('jwtToken'));
    if (window.localStorage.getItem('jwtToken') !== null) {
      console.log(token)
      axios
        .get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token.slice(10, -2)}`
          }
        })
        .then(res => {
          if (isMounted) {
            setProfile(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
  }, [token]);

  return (
    <Router>
      <NavBar />
      <div>
        <div className={UserService.isAuthenticated() !== false ? 'routerContainer' : ''}>
          <br />
          <Switch>
            <Route path='/' exact render={props => (
              <MainView {...props} universities={universities} profile={profile} />
            )} />
            <Route path='/auth/login' component={LogInView} />
            <Route path='/profile' render={props => (
              <ManageProfileView {...props} universities={universities} />
            )} />
            <Route path='/tutors/:subjectId' exact component={TutorsView} />
            <Route path='/tutors/:subjectId/booking/:tutorId' exact component={BookTutorView} />
            <Route path='/tutors/:subjectId/profiles/:tutorId' exact component={TutorProfileView} />
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

