import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Label, Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './account.css';
import NavLink from '../NavLinkComponent/navlink';
import AccountProfile from './AccountPartial/account_profile';
import AccountMentor from './AccountPartial/account_mentor';
import AccountBalance from './AccountPartial/account_balance';
import AccountApply from './AccountPartial/account_apply';
import AccountService from './AccountPartial/account_service';
import AccountAdmin from './AccountPartial/account_admin';
import AccountLogout from "./AccountPartial/account_logout";
import AccountForbidden from "./AccountPartial/account_forbidden";
import MentorEdit from "./AccountPartial/mentor_edit";
import CreateArticle from "./AccountPartial/create_article";
import AccountNotification from "./AccountPartial/account_notification";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {userStatus} from "../redux/userReducer";


class Account extends Component {



  render() {
    const user = this.props.user;

    if(user.status === userStatus.logout){
      this.context.router.history.push('/login');
      return;
    }

    if(user.status === userStatus.pending){
      return (
        <div className="loading-news-view">
            <Button basic loading>Loading</Button>
        </div>
      );
    }

    return (
      <div className="back-container">
      <div className="ui container account-main-container">
        <div className="ui grid">
        {
          (this.props.width > 767) ? (
          <div className="four wide column account-side-container">
            <div className="ui vertical fluid tabular menu account-side-no-container">
              <div className="account-status">
                <Icon name='graduation'  color="blue" className="menu-icon" />
                您的账号状态：{user.ismentor ? "Mentor":"Mentee"}
              </div>

              <NavLink to="/account/">
              <Icon name='info'  className="menu-icon" />
                基础资料
              </NavLink>
              {
                user.ismentor ? (
                   <div><NavLink to="/account/mentor_edit">
                     <Icon name='edit'  className="menu-icon" />编辑导师档案
                    </NavLink>
                    <NavLink to="/account/balance">
                      <Icon name='dollar' className="menu-icon" />我的余额
                    </NavLink>
                    <NavLink to="/account/service">
                      <Icon name='users'  className="menu-icon" />我的Mentee
                    </NavLink>
                    <NavLink to="/account/create_article">
                      <Icon name='write'  className="menu-icon" />编写干货
                    </NavLink></div>):(
                    <div><NavLink to="/account/mentor">
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
                  (!isNaN(user.num_notifications) && user.num_notifications!==0) &&
                    (<Label color='red'>
                      {user.num_notifications}
                    </Label>)
                }

              </NavLink>
              {
                user.isadmin && (
                  <NavLink to="/account/admin">
                    <Icon name='user secret'  className="menu-icon" />管理员页面
                  </NavLink>)
              }
              <NavLink to="/account/logout">
                <Icon name='log out'  className="menu-icon" />注销
              </NavLink>
            </div>
          </div>) : (<div></div>)
          }
          <div className= {((this.props.width > 767) ? "twelve" : "sixteen") + " wide stretched column " }>
            <div className="account-partial-container">
              {user.isactivated ? (
                <Switch onChange={this.onRouteChange}>
                  <Route path='/account/mentor' render={()=><AccountMentor user={user}/>} />
                  <Route path='/account/balance' render={()=><AccountBalance user={user}/>} />
                  <Route path='/account/apply' render={()=><AccountApply user={user}/>} />
                  <Route path='/account/service' render={()=><AccountService user={user}/>} />
                  <Route path='/account/mentor_edit' render={()=><AccountApply user={user}/>} />  {/** Temporarily change to AccountApply, used to be MentorEdit**/}
                  <Route path='/account/create_article' render={()=><CreateArticle user={user}/>} />
                  <Route path='/account/notification' render={()=><AccountNotification user={user}/>} />
                  <Route path='/account/admin' render={()=><AccountAdmin user={user}/>} />
                  <Route path='/account/logout' render={()=><AccountLogout/>} />
                  <Route path='/account/' render={()=><AccountProfile/>} />
                </Switch>
              )
                : (<Switch onChange={this.onRouteChange}>
                    <Route path='/account/logout' render={()=><AccountLogout/>} />
                    <Route path='/account/' render={()=><AccountForbidden />} />
                  </Switch>)}

            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

Account.contextTypes = {
  router: PropTypes.object
};

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default withRouter(connect(mapStateToProps)(Account));
