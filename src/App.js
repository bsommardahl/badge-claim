import React, { Component } from 'react';
import './App.css';
import RedirectBadgr from './RedirectBadgr';
import LandingContainer from './containers/LandingContainer';
import AwardContainer from './containers/AwardContainer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render () {
      return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path='/' component={LandingContainer} />
              <Route path='/badgeid/:badge_token' component={RedirectBadgr}/>
              <Route path='/award/:badge_token' component={AwardContainer}/>
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
