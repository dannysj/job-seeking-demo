import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Label, Icon } from 'semantic-ui-react';
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


class Account extends Component {



  render() {
    if(this.props.user == null){
      this.context.router.history.push('/login');
      return;
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
                您的账号状态：{this.props.user.ismentor ? "Mentor":"Mentee"}
              </div>

              <NavLink to="/account/">
              <Icon name='info'  className="menu-icon" />
                基础资料
              </NavLink>
              {
                this.props.user.ismentor ? (
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
                  (!isNaN(this.props.user.num_notifications) && this.props.user.num_notifications!==0) &&
                    (<Label color='red' floating>
                      {this.props.user.num_notifications}
                    </Label>)
                }

              </NavLink>
              {
                this.props.user.isadmin && (
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
              {this.props.user.isactivated ? (
                <Switch onChange={this.onRouteChange}>
                  <Route path='/account/mentor' render={()=><AccountMentor user={this.props.user}/>} />
                  <Route path='/account/balance' render={()=><AccountBalance user={this.props.user}/>} />
                  <Route path='/account/apply' render={()=><AccountApply user={this.props.user}/>} />
                  <Route path='/account/service' render={()=><AccountService user={this.props.user}/>} />
                  <Route path='/account/mentor_edit' render={()=><MentorEdit user={this.props.user}/>} />
                  <Route path='/account/create_article' render={()=><CreateArticle user={this.props.user}/>} />
                  <Route path='/account/notification' render={()=><AccountNotification user={this.props.user}/>} />
                  <Route path='/account/admin' render={()=><AccountAdmin user={this.props.user}/>} />
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


export default Account;
