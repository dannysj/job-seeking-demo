import React, {Component} from 'react';
import axios from 'axios';
import {Image} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './user.less';
import {getAuthHeader} from "../utils";
import Loading from "../Components/Loading";

class UserDetail extends Component {
  state = {
    user: {},
    is_resume_open: false,
    isDown: true,
    notAuthorized: false,
    isLoading: true
  };


  componentDidMount(){
    this.setState({isLoading: true});
    axios.post('/api/get_mentee_info', {mentee_uid: this.props.match.params.uid}, getAuthHeader()).then(res => {
      this.setState({user: res.data.user, isLoading: false});
    }).catch(()=>{
      this.setState({notAuthorized: true});
    });
  }

  resumeToggled = (e) => {
    let check = this.state.is_resume_open;
    let down = this.state.isDown;
    this.setState({is_resume_open: !check, isDown: !down});
  };

  random = (num) => {
    return parseInt(Math.random() * num);
  };

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
  };

  render() {
    let modalClassName='ui modal';
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }

    if(this.state.notAuthorized){
      return (<div>'您没有阅读此页的权限'</div>);
    }

    if (this.state.isLoading) {
      return (<Loading/>);
    }

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
          <embed className="resume-holder" src={this.state.user.resume} width="100%" type='application/pdf'/>
        </div>

      </div>
    );
  }
}

UserDetail.contextTypes = {
    router: PropTypes.object
};

export default UserDetail;
