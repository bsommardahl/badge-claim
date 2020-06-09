import React, { Component } from 'react';
import './App.css';
import RedirectBadgr from './RedirectBadgr';
import LandingContainer from './containers/LandingContainer';
import AwardContainer from './containers/AwardContainer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pathway from './components/Pathway/Pathway';
import PrivateRoute from './components/Auth/PrivateRoute'
import LogIn from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import WebhooksManagement from './components/Webhooks/WebhooksManagement';
import AppNavbar from './AppNavbar';

class App extends Component {
  render () {
      return (
        <Router>
          <div>
            <AppNavbar/>
            <Switch>
              <Route exact path='/' component={LandingContainer} />
              <Route path='/badgeid/:badge_token' component={RedirectBadgr}/>
              <Route path='/award/:badge_token' component={AwardContainer}/>
              <Route path='/login' component={LogIn}/>
              <PrivateRoute component={Dashboard} path='/dashboard' />
              <PrivateRoute component={Pathway} path="/pathway/:pathway_id" />
              <PrivateRoute component={WebhooksManagement} path='/webhooks' />
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
