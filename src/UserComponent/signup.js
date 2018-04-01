import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './user.css';

//TODO Replace all alert with custom error message system

class Signup extends Component {

  constructor (props) {
    super(props);
    this.state={user:{}};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // if(this.context.user)
    //   this.context.user = null;


    // this.context.router.route.location.pathname
  }

  handleSubmit (e) {
    e.preventDefault();
    if(this.state.user.password == this.state.user.cpassword){
      axios.post('http://localhost:3005/api/create_user',this.state.user).then(res => {
        if(res.data.code==0){
          this.props.onSuccess(res.data.user); // TODO: use the user profile returned by the server
          this.context.router.history.push('/account');
        }
        else{
          alert();
        }
      });
    }
    else{
      alert('Password does not match');
    }

  }

  handleChange (e) {
    let curUser = this.state.user;
    curUser[e.target.name]=e.target.value;
    this.setState({user: curUser});
  }

  render() {
    console.log(this.props);
    console.log(this.context);
    return (
      <div class="login-signup-container">
        <form class="ui form" onSubmit={this.handleSubmit}>
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" onChange={this.handleChange.bind(this)} required />
          </div>
          <div class="field">
            <label>姓</label>
            <input type="text" name="last" placeholder="Last Name" onChange={this.handleChange} required/>
          </div>
          <div class="field">
            <label>名</label>
            <input type="text" name="first" placeholder="First Name" onChange={this.handleChange} required />
          </div>
          <div class="field">
            <label>密码</label>
            <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
          </div>
          <div class="field">
            <label>确认密码</label>
            <input type="password" name="cpassword" placeholder="Confirm Password" onChange={this.handleChange} required />
          </div>
          <Link to="/login">已有账号？点击登陆</Link>
          <br /><br />
          <button class="ui button" type="submit">注册</button>
        </form>
      </div>
    );
  }
}

Signup.contextTypes = {
    router: PropTypes.object
};

export default Signup;
