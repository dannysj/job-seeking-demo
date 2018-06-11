import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Icon, Label} from 'semantic-ui-react';
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


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      is_checked: false,
      is_user_checked: false,
      width: 0,
      height: 0,
      current_page: "主 页",
      num_notifications: 0
    };
    this.updateUser = this.updateUser.bind(this);
    this.menuToggled = this.menuToggled.bind(this);
    this.user_menuToggled = this.user_menuToggled.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
    this.toggle_outside = this.toggle_outside.bind(this);

    let uid = localStorage.getItem('uid');
    if(uid){
      this.state = {user: {id: uid}};
      axios.post(process.env.REACT_APP_API_HOST + '/api/get_user_info',{uid:uid}).then(res => {
        if(res.data.code==0){
          this.updateUser(res.data.user);
        }
        else{
          alert('Database Error'); // TODO: proper err
        }
      });
    }
  }

  updateUser(user) {
    this.setState({user: user, is_checked: false});
    localStorage.setItem('uid', user.id);
  }


  updateCurrentPage(name) {
    this.setState({current_page: name, menu_open: false});

  }

  menuToggled(e) {
    e.stopPropagation();
    let check = this.state.is_checked;
    this.setState({is_checked: !check});
  }

  user_menuToggled(e) {
    e.stopPropagation();
    let check = this.state.is_user_checked;
    this.setState({is_checked: false, is_user_checked: !check});
    // FIXME:
  }

  toggle_outside(e) {
    this.setState({is_checked: false, is_user_checked: false});
  }

  /* for window dimension purpose */

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    return (
      <div className="app-flex">
        <input type="checkbox" id="reveal-menu" className="reveal-m" role="button" checked={this.state.is_checked ? "checked" : ""}></input>
        <input type="checkbox" id="reveal-user-menu" className="reveal-um" role="button" checked={this.state.is_user_checked ? "checked" : ""}></input>
        <div className={"navbar "} onClick={this.toggle_outside}>

          <div className="item logo-item" >
            <img src="/img/icon.png" height="40px"></img>
            <b className="title">{' '}Buddy{'\n'}Career</b>

            <label forName="reveal-menu" className="menu-icon" onClick={this.menuToggled}>
                <span className="bread bread-top">
                </span>

              <span className="bread bread-bottom">
                </span>
            </label>
          </div>
          <div className={"nav-list " }>
            <NavLink to="/" ishorizontal={true} onClick={this.menuToggled}>
              <div className="Nav-item ">
                <div className="App-subtitle">Home</div>
                <div className="chinese-top">主页</div>
              </div>
            </NavLink>
            <NavLink to="/mentor" ishorizontal={true} onClick={this.menuToggled}>
              <div className="Nav-item ">
                <div className="App-subtitle">Tutors</div>
                <div className="chinese-top">导师</div>
              </div>
            </NavLink>
            <NavLink to="/news" ishorizontal={true} onClick={this.menuToggled}>
              <div className="Nav-item ">
                <div className="App-subtitle">Careers</div>
                <div className="chinese-top">就业干货</div>
              </div>
            </NavLink>
            <NavLink to="/about" ishorizontal={true} onClick={this.menuToggled}>
              <div className="Nav-item ">
                <div className="App-subtitle">About</div>
                <div className="chinese-top">关于</div>
              </div>
            </NavLink>
          </div>
          <UserStatus user={this.state.user} onClick={this.user_menuToggled} passFor="reveal-user-menu" numnotifications={this.state.num_notifications}></UserStatus>
        </div>
        {
          (this.state.user) ? (
            <div className="user-menu" onClick={this.user_menuToggled}>
              <div className="item name" >
                <div className="user-name">{
                  this.state.user.last+this.state.user.first
                }</div>
                <div>
                {
                  this.state.user.email
                }
                </div>
              </div>
              <div className="item account-status">
                <Icon name='graduation'  color="blue" className="menu-icon" />
                {this.state.user.ismentor ? "Mentor":"Mentee"}
              </div>

              {
                this.state.user.ismentor ? (
                   <NavLink to="/account/balance">
                    <Icon name='dollar' className="menu-icon" />{this.state.user.balance}
                  </NavLink>
                ) : (<div></div>)
              }


              <NavLink to="/account/">
              <Icon name='info'  className="menu-icon" />
                基础资料
              </NavLink>
              {
                this.state.user.ismentor ? (<div>
                   <NavLink to="/account/mentor_edit">
                     <Icon name='edit'  className="menu-icon" />编辑导师档案
                    </NavLink>
                    <NavLink to="/account/service">
                      <Icon name='users'  className="menu-icon" />我的Mentee
                    </NavLink>
                    <NavLink to="/account/create_article">
                      <Icon name='write'  className="menu-icon" />编写干货
                    </NavLink></div>):(<div>
                    <NavLink to="/account/mentor">
                     <Icon name='user secret'  className="menu-icon" />我的导师
                   </NavLink>
                    <NavLink to="/account/apply">
                      <Icon name='add user'  className="menu-icon" />申请成为导师
                    </NavLink></div>)
              }
              <NavLink to="/account/notification">
                <Icon name='chat' className="menu-icon" />
                系统通知
                {
                  (!isNaN(this.state.user.num_notifications) && this.state.user.num_notifications!=0) &&
                    (<Label color='red' floating>
                      {this.state.user.num_notifications}
                    </Label>)
                }

              </NavLink>
              {
                this.state.user.isadmin && (
                  <NavLink to="/account/admin">
                    <Icon name='user secret'  className="menu-icon" />管理员页面
                  </NavLink>)
              }
              <NavLink to="/account/logout">
                <Icon name='log out'  className="menu-icon" />注销
              </NavLink>
            </div>
          ) : (<div></div>)
        }

        <div className="site-content" onClick={this.toggle_outside}>
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
      </div>
    );
  }
}

export default App;
