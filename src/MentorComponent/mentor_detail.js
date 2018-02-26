import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './mentor.css';

class MentorDetail extends Component {

  constructor (props) {
    super(props);
    this.state={mentor:{first:"", last:""}};
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
              <p><b>在读院校：</b>University of Wisconsin-Madison</p>
              <p><b>offer成就：</b>Lucid Software Summer Intern</p>
              <p><b>简介：</b>这里是一些简介信息</p>
              <p><b>经历：</b>这里是一些主要经历</p>
            </div>
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
              <tr>
                <td>简历修改</td>
                <td>1000 USD</td>
                <td>将提供细致入微的简历修改意见，并与mentee一同修改</td>
              </tr>
              <tr>
                <td>Mock Interview</td>
                <td>500 USD</td>
                <td>将提供模拟面试，时长30分钟，事后将提出整改意见</td>
              </tr>
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
