import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Dropdown, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class UserDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      user:{}
    };

    axios.post('/api/get_user_info',{uid:this.props.match.params.uid}).then(res => {
      if(res.data.code==0){
        console.log(res.data.user);
        this.setState({user:res.data.user});
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  render() {
    let modalClassName='ui modal';
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }

    return (
      <Container text style={{marginTop: '20px'}}>
        <div className="ui grid">
          <div className="six wide column">
            <Image size='medium' rounded src={this.state.user.profile_pic}></Image>
          </div>
          <div className="ten wide column">
            <h2 className="ui header">
              <i className="address card icon"></i>
              <div className="content">
                用户介绍：
                <div className="sub header">{this.state.user.last+this.state.user.first}的详细资料</div>
              </div>
            </h2>
            <div>
              <p><b>专业：</b>{this.state.user.major}</p>
              <p><b>Email：</b>{this.state.user.email}</p>
              <p><b>Wechat：</b>{this.state.user.wechat}</p>
              <p><b>自我介绍：</b>{this.state.user.cover}</p>
            </div>
          </div>
        </div>

        <div className="detail-section" style={{height: '100vh'}}>
          <h2 className="ui header">
            <i className="file alternate outline icon"></i>
            <div className="content">
              简历
            </div>
          </h2>
          <iframe className="resume-holder" width="100%" height="100%" src={this.state.user.resume}>
          </iframe>
        </div>
      </Container>
    );
  }
}

UserDetail.contextTypes = {
    router: PropTypes.object
};

export default UserDetail;
