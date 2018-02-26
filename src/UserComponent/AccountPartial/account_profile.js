import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountProfile extends React.Component {
    render() {
        return(
          <div className="ui big celled list">
            <div className="item">
              <img className="ui medium image" src={this.props.user.profile_pic}></img>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">Email</div>
                {this.props.user.email}
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">姓</div>
                {this.props.user.last}
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">名</div>
                {this.props.user.first}
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">理想行业</div>
                ...
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">出生日期</div>
                {this.props.user.dob}
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">注册日期</div>
                {this.props.user.register_date}
              </div>
            </div>
            <div className="item">
              <div className="content">
                <div className="header">自我介绍</div>
                {this.props.user.cover}
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
