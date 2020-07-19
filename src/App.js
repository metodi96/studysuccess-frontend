import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import TutorsView from './views/TutorsView';
import MainView from './views/MainView'
import CurrentBookingsView from './views/CurrentBookingsView';
import NavBar from './components/NavBar';
import BookTutorView from './views/BookTutorView';
import BookingAddSuccessView from './views/BookingAddSuccessView';
import PastBookingsView from './views/PastBookingsView';
import PendingBookingsView from './views/PendingBookingsView';
import BookingAcceptedSuccessView from './views/BookingAcceptedSuccessView';
import TutorProfileView from './views/TutorProfileView';
import ManageProfileView from './views/ManageProfileView';
import UserService from './services/UserService';
import LogInView from './views/LogInView';
import PendingBookingsTutorView from './views/PendingBookingsTutorView';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';

const useStylesSort = makeStyles(() => ({
  root: {
    display: 'flex'
  },

  footer: {
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(152, 158, 157)',
    color: 'white',
    textAlign: 'center'
  }
}));

function App() {

  const [profile, setProfile] = useState(undefined);
  const [token, setToken] = useState(window.localStorage.getItem('jwtToken'));
  const [loading, setLoading] = useState(true);
  const classesSort = useStylesSort();

  const universities = [
    {
      value: 'TUM',
      label: 'TUM'
    }
  ];

  const studyPrograms = [
    {
      value: 'Informatics',
      label: 'Informatics'
    },
    {
      value: 'Information Systems',
      label: 'Information Systems'
    },
    {
      value: 'Data Engineering and Analytics',
      label: 'Data Engineering and Analytics'
    },
    {
      value: 'Bioinformatics',
      label: 'Bioinformatics'
    }
  ];

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    setToken(window.localStorage.getItem('jwtToken'));
    if (UserService.isAuthenticated()) {
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
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        })
    } else {
      setLoading(false);
    }
    return () => { isMounted = false } // use effect cleanup to set flag false, if unmounted
  }, [token]);

  return (
    !loading ?
      <Router>
        <div style={{position: 'relative'}}>
          <NavBar />
          <div>
            <div className={UserService.isAuthenticated() !== false ? 'routerContainer' : ''}>
              <br />
              <Switch>
                <Route path='/' exact render={props => (
                  <MainView {...props} universities={universities} />
                )} />
                <Route path='/auth/login' render={props => {
                  if (!UserService.isAuthenticated()) {
                    return <LogInView {...props} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/profile' render={props => {
                  if (UserService.isAuthenticated()) {
                    return <ManageProfileView {...props} studyPrograms={studyPrograms} universities={universities} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/pendingTutor' render={props => {
                  if (UserService.isAuthenticated() && profile.hasCertificateOfEnrolment && profile.hasGradeExcerpt) {
                    return <PendingBookingsTutorView {...props} classesSort={classesSort} />
                  } else if (!UserService.isAuthenticated()) {
                    return <Redirect to={'/'} />
                  } else if (!profile.hasCertificateOfEnrolment || !profile.hasGradeExcerpt) {
                    return <Redirect to={'/profile'} />
                  }
                }} />
                <Route path='/tutors/:subjectId' exact component={TutorsView} />
                <Route path='/tutors/:subjectId/booking/:tutorId' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <BookTutorView {...props} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/tutors/:subjectId/profiles/:tutorId' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <TutorProfileView {...props} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/current' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <CurrentBookingsView {...props} classesSort={classesSort} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/success' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <BookingAddSuccessView {...props} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/successAccepted' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <BookingAcceptedSuccessView {...props} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/past' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <PastBookingsView {...props} classesSort={classesSort} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='/bookings/pending' exact render={props => {
                  if (UserService.isAuthenticated()) {
                    return <PendingBookingsView {...props} classesSort={classesSort} />
                  } else {
                    return <Redirect to={'/'} />
                  }
                }} />
                <Route path='*' render={() => {
                    return <Redirect to={'/'} />
                }} />
              </Switch>
            </div>
          </div>
            <div className={classesSort.footer}>
              <p>{new Date().getFullYear()} StudySuccess. All rights reserved.</p>
            </div>
         </div>
      </Router> : <div style={{marginBottom: '1080px'}}>Loading page...</div>
  );
}

export default App;

