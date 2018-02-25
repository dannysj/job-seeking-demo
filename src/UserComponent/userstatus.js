import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class UserStatus extends Component {

  constructor (props) {
    super(props);

    this.state={isloggedin:false};
    axios.post('http://localhost:3005/api/all_mentor_list',{}).then(res => {
      console.log(res);
      if(res.data.code==0){
        console.log(res.data.list);
        this.setState({mentors:res.data.list});
      }
      else{
        //TODO: Error Handling
      }
    });
    // this.context.router.route.location.pathname
  }

  render() {
    if(this.context.user){
      return (
        <div className="ui item">
          <Link to="/login">
              Login or Signup
          </Link>
        </div>
      );
    }
    return (
      <div className="right menu">
        <div className="item">
          <Link className="item" to="/login">
              Login
          </Link>
        </div>
        <div className="item">
          <Link className="item" to="/signup">
              Signup
          </Link>
        </div>
      </div>
    );
  }
}

export default UserStatus;
