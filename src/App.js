// UI
import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.less';
import {NotificationContainer} from 'react-notifications';
// Components
import NavLink from './NavLinkComponent/navlink';
import Home from './HomeComponent/home';
import Mentor from './MentorComponent/mentor';
import UserStatus from './UserComponent/userstatus';
import Login from './UserComponent/login';
import Signup from './UserComponent/signup';
import Account from './UserComponent/account';
import MentorDetail from './MentorComponent/mentor_detail';
import UserDetail from './UserComponent/user_detail';
import News from './NewsComponent/news';
import NewsDetail from './NewsComponent/news_detail';
import About from './AboutComponent/about';
import Reset from './UserComponent/reset';
// Redux
import store from "./redux";
import {fetchUser, setUser} from "./redux/userAction";
import {connect, Provider} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {hot} from 'react-hot-loader'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      is_checked: false,
      is_user_checked: false,
      width: 0,
      height: 0,
      current_page: "主 页"
    };

    this.menuToggled = this.menuToggled.bind(this);
    this.user_menuToggled = this.user_menuToggled.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
    this.toggle_outside = this.toggle_outside.bind(this);
  }

  componentWillMount(){
    if (this.props.user && this.props.user.access_token)
      store.dispatch(fetchUser(this.props.user.access_token));
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
    const user = this.props.user;
    return (
      <div className="app-flex">
        <NotificationContainer />
        <input type="checkbox" id="reveal-menu" className="reveal-m" role="button" checked={this.state.is_checked ? "checked" : ""}/>
        <input type="checkbox" id="reveal-user-menu" className="reveal-um" role="button" checked={this.state.is_user_checked ? "checked" : ""}/>
        <div className={"navbar "} onClick={this.toggle_outside}>

          <div className="item logo-item" >
            <img src="/img/icon.png" height="40px" alt="icon"></img>
            <b className="title">{' '}同行{'\n'}求职</b>

            <label forname="reveal-menu" className="menu-icon" onClick={this.menuToggled}>
                <span className="bread bread-top">
                </span>

              <span className="bread bread-bottom">
                </span>
            </label>
          </div>
          <div className={"nav-list " }>
            <NavLink to="/" onClick={this.menuToggled} isHorizontal>
              <div className="Nav-item ">
                <div className="App-subtitle">Home</div>
                <div className="chinese-top">主页</div>
              </div>
            </NavLink>
            <NavLink to="/mentor" onClick={this.menuToggled} isHorizontal>
              <div className="Nav-item ">
                <div className="App-subtitle">Tutors</div>
                <div className="chinese-top">导师</div>
              </div>
            </NavLink>
            <NavLink to="/news" onClick={this.menuToggled} isHorizontal>
              <div className="Nav-item ">
                <div className="App-subtitle">Careers</div>
                <div className="chinese-top">就业干货</div>
              </div>
            </NavLink>
            <NavLink to="/about" onClick={this.menuToggled} isHorizontal>
              <div className="Nav-item ">
                <div className="App-subtitle">About</div>
                <div className="chinese-top">关于</div>
              </div>
            </NavLink>
          </div>
          <UserStatus
            user={user}
            onClick={this.user_menuToggled}
            passFor="reveal-user-menu"/>
        </div>
        {
          (user) ? (
            <div className="user-menu" onClick={this.user_menuToggled}>
              <div className="item name" >
                <div className="user-name">
                  {user.last + user.first}
                </div>
                <div>
                {
                  user.email
                }
                </div>


              </div>
              <div className="item account-status">
                <Icon name='graduation'  color="blue" className="tab menu-icon" />
                {user.ismentor ? "Mentor":"Mentee"}
              </div>

              {
                user.ismentor ? (
                   <NavLink to="/account/balance">
                    <Icon name='dollar' className="tab menu-icon" />{user.balance}
                  </NavLink>
                ) : (<div></div>)
              }


              <NavLink to="/account/">
              <Icon name='info'  className="tab menu-icon" />
                基础资料
              </NavLink>
              {
                user.ismentor ? (<div>
                   <NavLink to="/account/mentor_edit">
                     <Icon name='edit'  className="tab menu-icon" />编辑导师档案
                    </NavLink>
                    <NavLink to="/account/service">
                      <Icon name='users'  className="tab menu-icon" />我的Mentee
                    </NavLink>
                    <NavLink to="/account/create_article">
                      <Icon name='write'  className="tab menu-icon" />编写干货
                    </NavLink></div>):(<div>
                    <NavLink to="/account/mentor">
                     <Icon name='user secret'  className="tab menu-icon" />我的导师
                   </NavLink>
                    <NavLink to="/account/apply">
                      <Icon name='add user'  className="tab menu-icon" />申请成为导师
                    </NavLink></div>)
              }
              <NavLink to="/account/notification">
                <Icon name='chat' className="tab menu-icon" />
                系统通知
                {
                  (!isNaN(user.num_notifications) && user.num_notifications !== 0) &&
                    (<Label color='red' floating>
                      {user.num_notifications}
                    </Label>)
                }

              </NavLink>
              {
                user.isadmin && (
                  <NavLink to="/account/admin">
                    <Icon name='user secret'  className="tab menu-icon" />管理员页面
                  </NavLink>)
              }
              <NavLink to="/account/logout">
                <Icon name='log out'  className="tab menu-icon" />注销
              </NavLink>
            </div>
          ) : (<div></div>)
        }

        <div className="site-content" onClick={this.toggle_outside}>
          <Provider store={store}>
          <Switch onChange={this.onRouteChange}>
            <Route path='/login' render={()=><Login/>} />
            <Route path='/signup' render={()=><Signup />}  />
            <Route path='/account' render={()=><Account user={user} width={this.state.width} height={this.state.height}/>} />
            <Route path="/mentor/:mid" render={(props)=><MentorDetail {...props} user={user}/>} />
            <Route path='/mentor' component={Mentor}/>
            <Route path="/user/:uid" render={(props)=><UserDetail {...props} user={user} width={this.state.width} height={this.state.height}/>} />
            <Route path='/news/:nid'   render={(props)=><NewsDetail {...props} loggedInUser={user}/> } />
            <Route path='/reset' component={Reset}/>
            <Route path='/news' component={News}/>
            <Route path='/about' component={About}/>
            <Route path='/' component={Home}/>
          </Switch>
          </Provider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default hot(module)(withRouter(connect(mapStateToProps)(App)));
