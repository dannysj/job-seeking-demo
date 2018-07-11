import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './user.less';
import { Message } from 'semantic-ui-react'
import store from "../redux";
import {setUser} from "../redux/userAction";
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Login extends Component {

  constructor (props) {
    super(props);
    this.state={user:{}};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();

    axios.post('/api/verify_user',this.state.user).then(res => {
      if(res.data.code===0){
        store.dispatch(setUser(res.data.user));
        if(this.context.router.history.location.pathname === "/login"){
          this.context.router.history.push("/");
          return;
        }
        this.context.router.history.goBack();
      }
      else{
        NotificationManager.error('登入失败', '错误');
      }
    });
  }

  handleChange (e) {
    let curUser = this.state.user;
    curUser[e.target.name]=e.target.value;
    this.setState({user: curUser});
  }

  render() {
    return (
      <div className="login-signup-container">
        <form className="ui form" onSubmit={this.handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required />
          </div>
          <div className="field">
            <label>密码</label>
            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
          </div>
          <div className="login-links">
          <Link to="/signup">还没有账号？注册账号</Link>
          <Link to="/reset">忘了密码？ 点我哦</Link>
          </div>
          <br /><br />
          <button className="ui button" type="submit">登陆</button>
        </form>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object
};


export default Login;
