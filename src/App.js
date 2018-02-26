import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './Semantic/semantic.min.css';
import './App.css';
import NavLink from './NavLinkComponent/navlink';
import Home from './HomeComponent/home';
import Mentor from './MentorComponent/mentor';
import UserStatus from './UserComponent/userstatus';
import Login from './UserComponent/login';
import Signup from './UserComponent/signup';
import Account from './UserComponent/account';
// import Signup from './UserComponent/signup';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(user) {
    this.setState({user: user});
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
          <UserStatus user={this.state.user}></UserStatus>
        </div>
        <Switch onChange={this.onRouteChange}>
          <Route path='/login' render={()=><Login onSuccess={this.updateUser}></Login>} />
          <Route path='/signup' render={()=><Signup onSuccess={this.updateUser}></Signup>}  />
          <Route path='/account' render={()=><Account user={this.state.user} onSuccess={this.updateUser}></Account>} />
          <Route path='/mentor' component={Mentor}/>
          <Route path='/' component={Home}/>
        </Switch>
      </div>
    );
  }
}

export default App;
