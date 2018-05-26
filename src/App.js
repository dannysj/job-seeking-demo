import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import axios from 'axios';
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

    let uid = localStorage.getItem('uid');
    if(uid){
      this.state = {user: {id: uid}};
      var handler = this;
      axios.post('/api/get_user_info',{uid:uid}).then(res => {
        if(res.data.code==0){
          handler.updateUser(res.data.user);
        }
        else{
          alert('Database Error'); // TODO: proper err
        }
      });
    }
  }

  updateUser(user) {
    this.setState({user: user});
    localStorage.setItem('uid', user.id);
  }

  render() {
    return (
      <div className="app-flex">
        <div className="ui top attached tabular menu">
          <div className="item">
            <img src="/img/icon.png" height="40px"></img>
            <b>{' '}Buddy{'\n'}Career</b>
          </div>
          <NavLink to="/" ishorizontal={true} >
            <div className="Nav-item ">
              <div className="App-subtitle">Home</div>
              <div className="chinese-top">主页</div>
            </div>
          </NavLink>
          <NavLink to="/mentor" ishorizontal={true}>
            <div className="Nav-item ">
              <div className="App-subtitle">Tutors</div>
              <div className="chinese-top">导师</div>
            </div>
          </NavLink>
          <NavLink to="/news" ishorizontal={true}>
            <div className="Nav-item ">
              <div className="App-subtitle">Careers</div>
              <div className="chinese-top">就业干货</div>
            </div>

          </NavLink>
          <NavLink to="/about" ishorizontal={true}>
            <div className="Nav-item ">
              <div className="App-subtitle">About</div>
              <div className="chinese-top">关于</div>
            </div>

          </NavLink>
          <UserStatus user={this.state.user}></UserStatus>
        </div>
        <Switch onChange={this.onRouteChange}>
          <Route path='/login' render={()=><Login onSuccess={this.updateUser}></Login>} />
          <Route path='/signup' render={()=><Signup onSuccess={this.updateUser}></Signup>}  />
          <Route path='/account' render={()=><Account user={this.state.user} onSuccess={this.updateUser}></Account>} />
          <Route path="/mentor/:mid" render={(props)=><MentorDetail {...props} user={this.state.user}></MentorDetail>} />
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
