import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import './account.css';
import NavLink from '../NavLinkComponent/navlink';
import AccountProfile from './AccountPartial/account_profile';
import AccountMentor from './AccountPartial/account_mentor';
import AccountBalance from './AccountPartial/account_balance';
import AccountApply from './AccountPartial/account_apply';
import AccountAdmin from './AccountPartial/account_admin';

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
              <a className="item">
                <img className="ui medium circular image" src={this.props.user.profile_pic}></img>
              </a>
              <NavLink to="/account/">
                基础资料
              </NavLink>
              <NavLink to="/account/mentor">
                我的导师
              </NavLink>
              <NavLink to="/account/balance">
                我的余额
              </NavLink>
              {
                !this.props.user.ismentor ? (
                  <NavLink to="/account/apply">
                    成为导师
                  </NavLink>) : (
                    <NavLink to="/account/service">
                      我的服务
                    </NavLink>)
              }
              {
                this.props.user.isadmin && (
                  <NavLink to="/account/admin">
                    管理员页面
                  </NavLink>)
              }
              <a className="item">
                注销
              </a>
            </div>
          </div>
          <div className="twelve wide stretched column">
            <div className="account-partial-container">
              <Switch onChange={this.onRouteChange}>
                <Route path='/account/mentor' render={()=><AccountMentor user={this.props.user}></AccountMentor>} />
                <Route path='/account/balance' render={()=><AccountBalance user={this.props.user}></AccountBalance>} />
                <Route path='/account/apply' render={()=><AccountApply user={this.props.user}></AccountApply>} />
                <Route path='/account/admin' render={()=><AccountAdmin user={this.props.user}></AccountAdmin>} />
                <Route path='/account/' render={()=><AccountProfile user={this.props.user}></AccountProfile>} />
              </Switch>
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
