import React, {Component} from 'react';
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './user.less';
import store from "../redux";
import {setUser} from "../redux/userAction";

class Signup extends Component {

  constructor (props) {
    super(props);
    this.state={
      user:{},

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleSubmit (e) {
    e.preventDefault();
    if (this.state.user.password !== this.state.user.cpassword) {
      NotificationManager.error('两次输入的密码不一致', '错误');
      return;
    }

    axios.post('/api/create_user', this.state.user).then(res => {
      store.dispatch(setUser(res.data.user));
      this.context.router.history.push('/account');
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
            <label>姓</label>
            <input type="text" name="last" placeholder="Last Name" onChange={this.handleChange} required/>
          </div>
          <div className="field">
            <label>名</label>
            <input type="text" name="first" placeholder="First Name" onChange={this.handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" onChange={this.handleChange.bind(this)} required />
          </div>
          <div className="field">
            <label>密码</label>
            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
          </div>
          <div className="field">
            <label>确认密码</label>
            <input type="password" name="cpassword" placeholder="Confirm Password" onChange={this.handleChange} required />
          </div>
          <Link to="/login">已有账号？点击登陆</Link>
          <br /><br />
          <button className="ui button" type="submit">注册</button>
        </form>
      </div>
    );
  }
}

Signup.contextTypes = {
    router: PropTypes.object
};

export default Signup;
