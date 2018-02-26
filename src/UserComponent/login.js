import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './user.css';

class Login extends Component {

  constructor (props) {
    super(props);
    this.state={user:{}};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();

    axios.post('http://localhost:3005/api/verify_user',this.state.user).then(res => {
      if(res.data.code==0){
        this.props.onSuccess(res.data.user);
        this.context.router.history.push('/account');
      }
      else{
        alert(); // TODO: proper err
      }
    });
  }

  handleChange (e) {
    let curUser = this.state.user;
    curUser[e.target.name]=e.target.value;
    this.setState({user: curUser});
    console.log(this.state);
  }

  render() {
    return (
      <div class="login-signup-container">
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


export default Login;
