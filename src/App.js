import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'
import SignUpView from './views/SignUpView';

//import Navbar from './components/Navbar.js' <Navbar /> 

function App() {
    return (
      <div className='container'>        
        <Router>                 
          <br/>
          <Switch>
            <Route path='/homepage' exact component={MainView} />
            <Route path='/tutors/:subjectId' component={TutorsView} />
            <Route path='/'component={SignUpView} />
          </Switch>          
        </Router>
      </div>
    );
}

export default App;

