import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Dropdown, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Arrow from "../Components/Arrow";
import Footer from '../Components/Footer';

class UserDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      user:{},
      is_resume_open:false,
      isDown:true,
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

    this.resumeToggled = this.resumeToggled.bind(this);
  }

  resumeToggled(e) {
    let check = this.state.is_resume_open;
    let down = this.state.isDown;
    this.setState({is_resume_open: !check, isDown: !down});
  }

  render() {
    let modalClassName='ui modal';
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }

    return (
      <div>
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

      </Container>
      <div id="resume" className="detail-section resume-section" style={{height:this.state.is_resume_open?'90vh':'50vh'}}>
        <div className="title">
            简历
          </div>
        <iframe className="resume-holder" src={this.state.mentor.resume} width="100%" type='application/pdf'></iframe>
        <label forName="reveal-resume" className="resume-name" onClick={this.resumeToggled}><span>{(this.state.isDown) ? "点\xa0\xa0\xa0\xa0击\xa0\xa0\xa0\xa0展\xa0\xa0\xa0\xa0开\xa0\xa0\xa0\xa0简\xa0\xa0\xa0\xa0历" : "缩\xa0\xa0\xa0\xa0小"}</span><span className="triangle-open"><Arrow isDown={this.state.isDown}/></span>
        </label>
      </div>



      </div>
    );
  }
}

UserDetail.contextTypes = {
    router: PropTypes.object
};

export default UserDetail;
