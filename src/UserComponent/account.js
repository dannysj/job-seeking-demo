import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from 'axios';
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


// TODO: Modify the structure of navlink

class Account extends Component {

  constructor (props) {
    super(props);
    console.log(this.props);
  }

  render() {
    if(this.props.user == null){
      this.context.router.history.push('/login');
      return;
    }
    return (
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <div className="ui vertical fluid tabular menu">
              <div>
                您的账号状态：{this.props.user.ismentor ? "Mentor":"Mentee"}
              </div>
              <Link to="/account/"><div className="item">
                <img className="ui medium circular image" src={this.props.user.profile_pic}/>
              </div></Link>

              <NavLink to="/account/">
                基础资料
              </NavLink>
              {
                this.props.user.ismentor ? (
                   <NavLink to="/account/mentor_edit">
                     我的公开档案
                    </NavLink>):(
                    <NavLink to="/account/mentor">
                     我的导师
                    </NavLink>)
              }

              <NavLink to="/account/balance">
                我的余额
              </NavLink>
              {
                !this.props.user.ismentor ? (
                  <NavLink to="/account/apply">
                    申请成为导师
                  </NavLink>) : (
                    <NavLink to="/account/service">
                      我的Mentee
                    </NavLink>)
              }
              {
                this.props.user.isadmin && (
                  <NavLink to="/account/admin">
                    管理员页面
                  </NavLink>)
              }
              <NavLink to="/account/logout">
                注销
              </NavLink>
            </div>
          </div>
          <div className="twelve wide stretched column">
            <div className="account-partial-container">
              {this.props.user.isactivated ? (
                <Switch onChange={this.onRouteChange}>
                  <Route path='/account/mentor' render={()=><AccountMentor user={this.props.user}/>} />
                  <Route path='/account/balance' render={()=><AccountBalance user={this.props.user}/>} />
                  <Route path='/account/apply' render={()=><AccountApply user={this.props.user}/>} />
                  <Route path='/account/service' render={()=><AccountService user={this.props.user}/>} />
                  <Route path='/account/mentor_edit' render={()=><MentorEdit user={this.props.user}/>} />
                  <Route path='/account/admin' render={()=><AccountAdmin user={this.props.user}/>} />
                  <Route path='/account/logout' render={()=><AccountLogout/>} />
                  <Route path='/account/' render={()=><AccountProfile user={this.props.user} onUpdate={this.props.onSuccess}/>} />
                </Switch>
              )
                : (<AccountForbidden />)}

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
