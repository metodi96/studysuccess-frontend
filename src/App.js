import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'

function App() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path='/' exact component={MainView} />
            <Route path='/tutors/:subjectId' component={TutorsView} />
          </Switch>
        </Router>
      </div>
    );
}

export default App;
