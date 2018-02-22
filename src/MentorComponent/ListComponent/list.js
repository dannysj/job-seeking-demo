import React, { Component } from 'react';
import axios from 'axios';
import './list.css';

class List extends Component {

  constructor (props) {
    super(props);

    this.state={mentors:[]};
    // axios.post('http://localhost:3005/api/industry_list',{}).then(res => {
    //   console.log('FUCK!!');
    //   console.log(res);
    //   if(res.data.code==0){
    //     console.log(res.data.list);
    //     this.setState({industries:res.data.list});
    //   }
    //   else{
    //     //TODO: Error Handling
    //   }
    // });
    // this.context.router.route.location.pathname
  }

  render() {
    return (
      <div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
      <div className="mentor-container">
        <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
        <h4>张三</h4>
      </div>
        <div className="mentor-container">
          <img className="mentor-picture" src="/img/sample_profile.jpg"></img>
          <h4>张三</h4>
        </div>
      </div>
    );
  }
}

export default List;
