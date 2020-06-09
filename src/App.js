import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react'
import './App.css';
import MainView from './views/MainView'
import TutorsView from './views/TutorsView'

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      routes: [
        { component: MainView, path: '/', exact: true },
        { component: TutorsView, path: '/tutors' }
      ]
    };
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            {this.state.routes.map((route, i) => (<Route key={i} {...route} />))}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
