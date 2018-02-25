import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './user.css';

class Login extends Component {

  constructor (props) {
    super(props);

    // if(this.context.user)
    //   this.context.user = null;

    // axios.post('http://localhost:3005/api/all_mentor_list',{}).then(res => {
    //   console.log(res);
    //   if(res.data.code==0){
    //     console.log(res.data.list);
    //     this.setState({mentors:res.data.list});
    //   }
    //   else{
    //     //TODO: Error Handling
    //   }
    // });
    // this.context.router.route.location.pathname
  }

  render() {
    return (
      <div class="login-signup-container">
        <form class="ui form">
          <div class="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="text" name="password" placeholder="Password" />
          </div>
          <Link to="/signup">I don't have an account yet, sign me up!</Link>
          <br /><br />
          <button class="ui button" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Login;
