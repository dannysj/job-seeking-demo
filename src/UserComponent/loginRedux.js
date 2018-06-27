import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './user.css';
import { Message } from 'semantic-ui-react'
import store from "../redux";
import {setUser} from "../redux/userAction";
import {verifyUser} from "../redux/userActionRewrite"
import {loginStatus} from "../redux/userReducerRewrite"
import {connect} from "react-redux"

const mapStateToProps = state =>{
  return { login: state.login }
}

class Login extends Component {

  constructor (props) {
    super(props);
    this.state={user:{}, isLoginFailed:false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // How to rewrite the redux here
  handleSubmit(e) {
    e.preventDefault();
    dispatch(verifyUser(this.state.user))
  }


  handleChange (e) {
    let curUser = this.state.user;
    curUser[e.target.name]=e.target.value;
    this.setState({user: curUser});
  }

  render() {
    if (this.props.login === loginStatus.LOGIN_SUCCESS){
      if(this.context.router.history.location.pathname === "/login"){
        this.context.router.history.push("/");
        return;
      }
      this.context.router.history.goBack();
      return
    }

    return (
      <div class="login-signup-container">
      {this.props.login === loginStatus.LOGIN_FAILURE ? (<Message negative>
    <Message.Header>Login failed. The email and password combination does not match.</Message.Header>
  </Message> )
        : (<div></div>) }
        <form class="ui form" onSubmit={this.handleSubmit}>
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required />
          </div>
          <div class="field">
            <label>密码</label>
            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
          </div>
          <Link to="/signup">还没有账号？注册账号</Link>
          <br /><br />
          <button class="ui button" type="submit">登陆</button>
        </form>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object
};

export default connect(mapStateToProps)(Login);
