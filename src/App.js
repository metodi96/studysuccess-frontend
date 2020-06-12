import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'
import LogInView from './views/LogInView';

//import Navbar from './components/Navbar.js' <Navbar /> 

function App() {
    return (
      <div className='container'>        
        <Router>                 
          <br/>
          <Switch>
            <Route path='/'exact component={MainView} />
            <Route path='/auth/login' component={LogInView} />
            <Route path='/tutors/:subjectId' component={TutorsView} />
            <Route path='*' component={MainView} />
          </Switch>          
        </Router>
      </div>
    );
}

export default App;

