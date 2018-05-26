import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import './index.css';

class ProfileFollow extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: this.props.user,
      action: this.props.actionClicked
    };
  }

  render() {
    return (
      <div className="follow-container">
        <img src={this.state.user.profile_pic}></img>
        <div className="follow-text-container">
          <div className="follow-title">
            <div className="follow-name">
              {this.state.user.last + this.state.user.first}
            </div>
            <Button
              size='mini'
              color='blue'
              content='关注'
              icon='plus'
              onClick={this.state.action}
            />
          </div>
          <div className="follow-subtitle">
            {"我是大哥 请叫我大佬"}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileFollow;
