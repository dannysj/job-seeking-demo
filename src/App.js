import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import NavLink from './NavLinkComponent/navlink'
import Home from './HomeComponent/home';
import Mentor from './MentorComponent/mentor'

class App extends Component {
  onRouteChange () {
    alert('ha');
  }

  render() {
    return (
      <div>
        <div className="ui top attached tabular menu">
          <div className="item">
            <img src="/img/icon.png" height="50px"></img>
            <b>Job Seeking</b>
          </div>
          <NavLink to="/">
            Home
          </NavLink>
          <NavLink to="/mentor">
            Mentor
          </NavLink>
          <NavLink to="/news">
            News
          </NavLink>
          <NavLink to="/join">
            Join
          </NavLink>
          <NavLink to="/about">
            About
          </NavLink>
          <div className="right menu">
            <div className="item">
              <div className="ui transparent icon input">
                <input type="text" placeholder="Search users..." />
                <i className="search link icon"></i>
              </div>
            </div>
          </div>
        </div>
        <Switch onChange={this.onRouteChange}>
          <Route path='/mentor' component={Mentor}/>
          <Route path='/' component={Home}/>
        </Switch>
      </div>
    );
  }
}

export default App;
