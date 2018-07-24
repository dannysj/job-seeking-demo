import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Dropdown, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Arrow from "../Components/Arrow";
import Footer from '../Components/Footer';
import './user.less';

class UserDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      user:{},
      is_resume_open:false,
      isDown:true,
      notAuthorized:false,
    };

    /**
    For anyone seeing this, I want to admit this is an EXTREMELY SHITTY way of
    doing the authorization. We should perform the authorization in backend (check the TODO comment in userInfoRouter)
    to make sure that the user id (mentee_uid) is indeed, a mentee of the api requester (identified by the access_token in the header).

    However, here, due to the asynic nature of redux, this.props.user is not populated instantly once the page is open.
    Instead, we need to wait for a couple of seconds before it is populated based on
    the info grabbed from the database asynchronously.
    Which means, if the user goes directly into user detail page, it is not going to work
    because the api request for the user info happens almost immediately.
    But, if the user access this page via his/her /account/service tab, it is going
    to work like a charm because this.props.user is already populated at that point.

    In short, the current code does prevent any malicious access by using the url directly.
    **/
    console.log(this.props.user);
    if(this.props.user.access_token == ''){
      this.state.notAuthorized = true;
    }
    else {
      axios.post(
        '/api/get_mentor_info',
        {mentee_uid:this.props.match.params.uid},
        {headers:{access_token: this.props.user.access_token}})
      .then(res => {
        if(res.data.code==0){
          console.log(res.data.user);
          this.setState({user:res.data.user});
        }
        else{
          //TODO: Error Handling
        }
      });
    }

    this.resumeToggled = this.resumeToggled.bind(this);
    this.random = this.random.bind(this);
    this.createStarryBackground = this.createStarryBackground.bind(this);
  }

  resumeToggled(e) {
    let check = this.state.is_resume_open;
    let down = this.state.isDown;
    this.setState({is_resume_open: !check, isDown: !down});
  }

  random(num) {
    return parseInt(Math.random() * num);
  }
  createStarryBackground = () => {
    let particles = []
    const min = 20;
    const max = 50;
    const rand = parseInt(min + Math.random() * (max - min));

    let styleSheet = document.createElement("style");
    // WebKit hack
    styleSheet.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.head.appendChild(styleSheet);

    let keyframes = '';
    for (var i = 0; i < rand; i++) {
      let size = this.random(5) + 5;
      let style = {
        position: 'absolute',
        borderRadius: '50%',
        animation: `starry-${i} 60s infinite`,

        opacity: Math.random(),
        height: size + "px",
        width: size + "px",
        animationDelay: `${i * 0.2}s`,
        transform: `translate3d((${this.random(90)} * 1vw), (${this.random(90)} * 1vh), (${this.random(100)} * 1px))`,
        background: `hsl(${this.random(360)}, 70%, 50%)`,
      };
      keyframes = `@keyframes starry-${i} {
          10% {transform:translate(${Math.random() * this.props.width}px, ${Math.random() * this.props.height}px)}
          90% {transform:translate(${Math.random() * this.props.width}px, ${Math.random() * this.props.height}px)}
          100% {transform:translate(${Math.random() * this.props.width}px, ${Math.random() * this.props.height}px)}
      }`;

      particles.push(<div style={style}></div>);
      styleSheet.sheet.insertRule(keyframes, i);
    }



    return particles;
  }

  render() {
    let modalClassName='ui modal';
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }
    console.log(this.state.notAuthorized);

    if(this.state.notAuthorized){
      return (<div>'您没有阅读此页的权限'</div>);
    }
    else {
    return (
      <div className="user-background">
        <div className="stars-background">
          {
            this.createStarryBackground()
          }
        </div>

        <div className="card">

          <Image size='medium' rounded src={this.state.user.profile_pic}></Image>
          <div className="title">{this.state.user.last+this.state.user.first}</div>
          <div className="subtitle">{this.state.user.major}</div>
          <div className="buttons">
            <p><b>Email@ </b>{this.state.user.email}</p>
            <p><b>Wechat@ </b>{this.state.user.wechat}</p>
          </div>


        </div>

        <div className="card">
        <div className="title">
            {this.state.user.last+this.state.user.first +"的个人简介"}
          </div>
          <div className="text-content">
          {this.state.user.cover}
          </div>
        </div>
        <div className="card">
          <div className="title">
              简历
            </div>
          <iframe className="resume-holder" src={this.state.user.resume} width="100%" type='application/pdf'></iframe>

        </div>

      </div>
    );
  }
  }
}

UserDetail.contextTypes = {
    router: PropTypes.object
};

export default UserDetail;
