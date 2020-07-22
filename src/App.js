import React, { Component } from 'react';
import './App.css';
import LandingContainer from './containers/LandingContainer';
import BadgeContainer from './containers/BadgeContainer';
import AwardContainer from './containers/AwardContainer'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pathway from './components/Pathway/Pathway';
import PrivateRoute from './components/Auth/PrivateRoute'
import LogIn from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import WebhooksManagement from './components/Webhooks/WebhooksManagement';
import AppNavbar from './AppNavbar';
import ListGroup from './components/Groups/ListGroup';
import NewGroup from './components/Groups/NewGroup';

class App extends Component {
  render () {
      return (
        <Router>
          <div>
            <AppNavbar/>
            <Switch>
              <Route exact path='/' component={LandingContainer} />
              <Route path='/badges/:badge_token' component={BadgeContainer}/>
              <Route path='/award/:badge_token' component={AwardContainer}/>
              <Route path='/login' component={LogIn}/>
              <PrivateRoute component={Dashboard} path='/explore' />
              <PrivateRoute component={Pathway} path="/pathway/:pathway_id" />
              <PrivateRoute component={WebhooksManagement} path='/webhooks' />
              <PrivateRoute  exact strict component={ListGroup} path='/groups' />
              <PrivateRoute  exact strict component={NewGroup} path='/groups/new' />
              <PrivateRoute  exact strict component={NewGroup} path='/groups/edit/:id' />
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
