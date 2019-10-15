import React, { Component } from 'react';
import './App.css';
import BadgeContainer from './containers/BadgeContainer';
import LandingContainer from './containers/LandingContainer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  
  render () {
      return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path='/' component={LandingContainer} />
              <Route path='/badgeid/:badge_token' component={BadgeContainer}/>
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
