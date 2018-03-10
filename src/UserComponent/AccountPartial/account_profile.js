import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountProfile extends React.Component {
    render() {
        return(
          <div className="ui large celled list">
            <div className="item">
              <img className="ui medium image profile_pic" src={this.props.user.profile_pic}></img>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">姓</div>
                <div className="info">{this.props.user.last}</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">名</div>
                <div className="info">{this.props.user.first}</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">Email</div>
                <div className="info">{this.props.user.email}</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">理想行业</div>
                <div className="info">...</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">出生日期</div>
                <div className="info">{this.props.user.dob}</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">注册日期</div>
                <div className="info">{this.props.user.register_date}</div>
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">自我介绍</div>
                <div className="info">{this.props.user.cover}</div>
              </div>
            </div>
          </div>
        );
    }
}

AccountProfile.contextTypes = {
    router: PropTypes.object
};

export default AccountProfile;
