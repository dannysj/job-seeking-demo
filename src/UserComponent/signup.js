import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './user.css';

//TODO Replace all alert with custom error message system

class Login extends Component {

  constructor (props) {
    super(props);
    this.state={user:{}};
    this.handleSubmit = this.handleSubmit.bind(this);

    // if(this.context.user)
    //   this.context.user = null;


    // this.context.router.route.location.pathname
  }

  handleSubmit (e) {

    if(this.state.user.password == this.state.user.cpassword){
      axios.post('http://localhost:3005/api/create_user',this.state.user).then(res => {
        console.log(res);
        if(res.data.code==0){

          // this.setState({mentors:res.data.list});
        }
        else{
          alert();
        }
      });
    }
    else{
      alert('Password does not match');
    }
    e.preventDefault();
  }

  handleChange (e) {
    let curUser = this.state.user;
    curUser[e.target.name]=e.target.value;
    this.setState({user: curUser});
  }

  render() {
    return (
      <div class="login-signup-container">
        <form class="ui form" onSubmit={this.handleSubmit}>
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" onChange={this.handleChange.bind(this)} required />
          </div>
          <div class="field">
            <label>Last Name</label>
            <input type="text" name="last" placeholder="Last Name" onChange={this.handleChange.bind(this)} required/>
          </div>
          <div class="field">
            <label>First Name</label>
            <input type="text" name="first" placeholder="First Name" onChange={this.handleChange.bind(this)} required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" onChange={this.handleChange.bind(this)} required />
          </div>
          <div class="field">
            <label>Comfirm Password</label>
            <input type="password" name="cpassword" placeholder="Confirm Password" onChange={this.handleChange.bind(this)} required />
          </div>
          <Link to="/signup">I already have an account, log me in!</Link>
          <br /><br />
          <button class="ui button" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Login;
