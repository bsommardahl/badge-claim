import React, { Component } from 'react';
import './App.css';
import Badge from './components/Badge/Badge';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render () {
      return (
        <Router>
          <div className="App">
            <Switch>
              <Route path='/badge/:badge_token' component={Badge}/>
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
