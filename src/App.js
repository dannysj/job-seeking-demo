import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Icon } from 'semantic-ui-react';
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
      menu_open: false,
      width: 0,
      height: 0,
      current_page: "主 页",
      num_notifications: 0
    };
    this.updateUser = this.updateUser.bind(this);
    this.menuToggled = this.menuToggled.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);

    let uid = localStorage.getItem('uid');
    if(uid){
      this.state = {user: {id: uid}};
      axios.post(process.env.REACT_APP_API_HOST + '/api/get_user_info',{uid:uid}).then(res => {
        if(res.data.code==0){
          console.log(res.data.user);
          this.updateUser(res.data.user);
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

  menuToggled(e) {
    this.setState({menu_open: !this.state.menu_open});
  }

  updateCurrentPage(name) {
    this.setState({current_page: name, menu_open: false});

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
    var opened = "";
    if (this.state.menu_open) {
      opened = "opened";
    }
    return (
      <div className="app-flex">
      {
        (this.state.width < 768 ) ? (
          <div className={"navbar " + opened}>
            <div className="item logo-item" onClick={this.menuToggled}>
            {
              (this.state.menu_open) ? (<Icon name='close' color="grey" size='big' />) : (<img src="/img/icon.png" height="40px"></img>)
            }

              <b>{' '}Buddy{'\n'}Career</b>
            </div>
            <div className="item title">
              <div className="chinese-top">{this.state.current_page}</div>
            </div>
            <div className={"nav-list " + opened }>
            <NavLink to="/" ishorizontal={true} onClick={() => {this.updateCurrentPage("主 页")}}>
              <div className="Nav-item ">
                <div className="App-subtitle">Home</div>
                <div className="chinese-top">主页</div>
              </div>
            </NavLink>
            <NavLink to="/mentor" ishorizontal={true} onClick={() => {this.updateCurrentPage("导 师")}}>
              <div className="Nav-item ">
                <div className="App-subtitle">Tutors</div>
                <div className="chinese-top">导师</div>
              </div>
            </NavLink>
            <NavLink to="/news" ishorizontal={true} onClick={() => {this.updateCurrentPage("就 业 干 货")}}>
              <div className="Nav-item ">
                <div className="App-subtitle">Careers</div>
                <div className="chinese-top">就业干货</div>
              </div>

            </NavLink>
            <NavLink to="/about" ishorizontal={true} onClick={() => {this.updateCurrentPage("关 于")}}>
              <div className="Nav-item ">
                <div className="App-subtitle">About</div>
                <div className="chinese-top">关于</div>
              </div>

            </NavLink>
            </div>
            <UserStatus user={this.state.user}></UserStatus>
          </div>
        ) : (
          <div className={"navbar "}>
            <div className="item logo-item" onClick={this.menuToggled}>
              <img src="/img/icon.png" height="40px"></img>
              <b>{' '}Buddy{'\n'}Career</b>
            </div>
            <div className={"nav-list " }>
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
            </div>
            <UserStatus user={this.state.user} numnotifications={this.state.num_notifications}></UserStatus>
          </div>
        )
      }

        <div className="site-content">
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
