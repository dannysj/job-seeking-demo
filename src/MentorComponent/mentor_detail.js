import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './mentor.css';

class MentorDetail extends Component {

  constructor (props) {
    super(props);
    this.state={mentor:{first:"", last:"", service:[]}};

    axios.post('http://localhost:3005/api/get_mentor_detail',{mid:this.props.match.params.mid}).then(res => {
      if(res.data.code==0){
        console.log(res.data.mentor);
        this.setState({mentor:res.data.mentor});
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  // {this.props.match.params.mid}

  render() {
    return (
      <div className="mentor-detail-container">
        <div className="ui grid">
          <div className="six wide column">
            <img className="mentor-img" src="/img/sample_profile.jpg"></img>
          </div>
          <div className="ten wide column">
            <h2 className="ui header">
              <i className="address card icon"></i>
              <div className="content">
                导师介绍
                <div className="sub header">{this.state.mentor.last+this.state.mentor.first}的详细资料</div>
              </div>
            </h2>
            <div>
              <p><b>在读院校：</b>{this.state.mentor.college_name}</p>
              <p><b>offer公司：</b>{this.state.mentor.offer_company}</p>
              <p><b>offer职位：</b>{this.state.mentor.offer_title}</p>
              <p><b>年龄：</b>{this.state.mentor.dob}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="id badge outline icon"></i>
            <div className="content">
              自我介绍
              <div className="sub header">关于导师的自我介绍</div>
            </div>
          </h2>
          <div>
            {this.state.mentor.bio}
          </div>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="calendar outline icon"></i>
            <div className="content">
              服务介绍
              <div className="sub header">具体服务范围</div>
            </div>
          </h2>
          <table class="ui celled table">
            <thead>
              <tr><th>服务名称</th>
              <th>服务价格</th>
              <th>具体介绍</th>
            </tr></thead>
            <tbody>
              {
                this.state.mentor.service.map(el => (
                  <tr>
                    <td>{el.name}</td>
                    <td>{el.price+' USD'}</td>
                    <td>{el.description}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="file alternate outline icon"></i>
            <div className="content">
              简历
            </div>
          </h2>
          <iframe className="resume-holder" width="100%" src={this.state.mentor.resume}>
          </iframe>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="comment alternate outline icon"></i>
            <div className="content">
              过往评价
            </div>
          </h2>
        </div>
      </div>


    );
  }
}

MentorDetail.contextTypes = {
    router: PropTypes.object
};

export default MentorDetail;
