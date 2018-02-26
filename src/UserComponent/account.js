import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import './account.css';
import AccountProfile from './AccountPartial/account_profile';

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
      <div>
        <div className="ui grid">
          <div className="four wide column">
            <div className="ui vertical fluid tabular menu">
              <a className="item">
                <img className="ui medium circular image" src={this.props.user.profile_pic}></img>
              </a>
              <a className="item active">
                Profile
              </a>
              <a className="item">
                My Mentors
              </a>
              <a className="item">
                Balance
              </a>
              <a className="item">
                Be a mentor
              </a>
              <a className="item">
                Log out
              </a>
            </div>
          </div>
          <div className="twelve wide stretched column">
            <Switch onChange={this.onRouteChange}>
              <Route path='/account/' render={()=><AccountProfile user={this.props.user}></AccountProfile>} />
            </Switch>
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
