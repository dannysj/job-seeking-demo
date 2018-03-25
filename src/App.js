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
import MentorDetail from './MentorComponent/mentor_detail';
import News from './NewsComponent/news';
import NewsDetail from './NewsComponent/news_detail';
import About from './AboutComponent/about';
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
            <b>Buddy Career</b>
          </div>
          <NavLink to="/">
            主页
          </NavLink>
          <NavLink to="/mentor">
            导师
          </NavLink>
          <NavLink to="/news">
            就业干货
          </NavLink>
          <NavLink to="/about">
            关于
          </NavLink>
          <UserStatus user={this.state.user}></UserStatus>
        </div>
        <Switch onChange={this.onRouteChange}>
          <Route path='/login' render={()=><Login onSuccess={this.updateUser}></Login>} />
          <Route path='/signup' render={()=><Signup onSuccess={this.updateUser}></Signup>}  />
          <Route path='/account' render={()=><Account user={this.state.user} onSuccess={this.updateUser}></Account>} />
          <Route path="/mentor/:mid" component={MentorDetail} />
          <Route path='/mentor' component={Mentor}/>
          <Route path='/news/:nid' component={NewsDetail}/>
          <Route path='/news' component={News}/>
          <Route path='/about' component={About}/>
          <Route path='/' component={Home}/>
        </Switch>
      </div>
    );
  }
}

export default App;
