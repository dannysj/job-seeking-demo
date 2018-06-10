import React, {Component} from 'react';
import axios from 'axios';
import {Button, Image, Divider, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import './mentor.css';
import CommentBox from "./CommentBox";
import Arrow from "../Components/Arrow";

class MentorDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {mentor: {first: "", last: "", service: []}, is_resume_open:false, isDown:true, showAddServiceModal: false};

    axios.post(process.env.REACT_APP_API_HOST + '/api/get_mentor_detail',{mid:this.props.match.params.mid}).then(res => {
      if(res.data.code===0){
        this.setState({mentor:res.data.mentor});
      }
      else{
        NotificationManager.error('无法获得Mentor信息', '错误');
      }
    });

    this.initBuy = this.initBuy.bind(this);
    this.resumeToggled = this.resumeToggled.bind(this);
  }

  resumeToggled(e) {
    let check = this.state.is_resume_open;
    let down = this.state.isDown;
    this.setState({is_resume_open: !check, isDown: !down});
  }

  initBuy(service_name, service_price){
    if(!this.props.user){
      this.context.router.history.push('/login');
      return;
    }
    var handler = this;
    axios.post(process.env.REACT_APP_API_HOST + '/api/create_order',
    {
      uid:this.props.user.id,
      mid:this.props.match.params.mid,
      service_name: service_name,
      service_price: service_price
    }).then(res => {
      console.log(res.data);
      if (res.data.code === 0) {
        window.location.href = res.data.url;
      }
      else{
        NotificationManager.error('数据库错误','错误');
      }
    });
  }

  pollPayment(order_id){
    var handler = this;
    axios.post(process.env.REACT_APP_API_HOST + '/api/poll_payment',
    {
      uid:this.props.user.id,
      order_id:order_id
    }).then(res => {
      console.log(res.data);
      if(res.data.code==0){
        // handler.setState({showAddServiceModal: false, qr_code: ''});
        alert('支付成功'); //TODO Notification System
        this.context.router.history.push('/account/mentor');
      }
      else if(res.data.code == 15){
        handler.pollPayment(order_id);
      }
      else{
        //TODO: Error Handling
      }
    });
  }


  render() {
    let modalClassName='ui modal';
    var test_url = '/img/banner.jpg';
    const backimgstyle = {
      backgroundImage: 'url('+test_url+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      };
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }

    const companyIcon = '/icons/company.png'
    const schoolIcon = '/icons/school.png'
    const posiIcon = '/icons/position.png'
    const ageIcon = '/icons/age.png'

      return (
      <div className="mentor-detail-container">
        <input type="checkbox" id="reveal-resume" className="reveal-resume" role="button" checked={this.state.is_resume_open ? "checked" : ""}></input>
        <NotificationContainer />
        <div className={modalClassName}>
            <i className="close icon"/>
          <div className="header">
            支付
          </div>
          <div className="add-service-form-container">
              <Image size="large" src={this.state.qr_code}/>
          </div>
          <div className="actions">
          </div>
        </div>

        <div className="mentor-background-image" style={backimgstyle}>
          <div className="ui container">
            <div className="mentor-name">
              <div className="chinese-top">{this.state.mentor.last+this.state.mentor.first}</div>
              <div className="App-subtitle">{"English name"}</div>
              <Divider hidden clearing />
              <Divider hidden clearing />
              <div className="small-bio" dangerouslySetInnerHTML={{__html:this.state.mentor.bio}}>

              </div>
            </div>
          </div>
        </div>
        <div className="mentor-detail-info-container">

          <div className="item detail-item">

            <div className="title">
            <img className="title-icon" alt="school" src={schoolIcon} height={50}/>
              在读院校
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.college_name}}>
            </div>
          </div>
          <div className="item detail-item">

            <div className="title">
            <img className="title-icon" alt="company" src={companyIcon} height={50}/>
              offer公司
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.offer_company}}>
            </div>

          </div>

          <div className="item detail-item">

            <div className="title">
              <img className="title-icon"  alt="position" src={posiIcon} height={50}/>
              offer职位
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.offer_title}}>
            </div>

          </div>

          <div className="item detail-item">

            <div className="title">
              <img className="title-icon"  alt="age" src={ageIcon} height={50}/>
              年龄
            </div>
            <div className="subtitle">{parseInt((new Date() - new Date(this.state.mentor.dob))/(365*24*3600*1000))}</div>

          </div>

        </div>

        <div className="detail-section resume-section">
          <div className="title">
              简历
            </div>
          <embed className="resume-holder" src={this.state.mentor.resume} width="100%" type='application/pdf'/>
          <label forName="reveal-resume" className="resume-name" onClick={this.resumeToggled}><span>{(this.state.isDown) ? "点 击 展 开 简 历" : "缩 小"}</span><span className="triangle-open"><Arrow isDown={this.state.isDown}/></span>
          </label>
        </div>

          {
            (this.state.mentor.service.length > 0) ? (
              <div className="mentor-service-overview detail-section">
                <div className="title">
                  服务介绍

                </div>
              <div className="para-medium">
                <b>{this.state.mentor.last+this.state.mentor.first}</b>
                本周还可提供{this.state.mentor.num_availability}次服务
              </div>
              <div className="mentor-service-container">
              {
                this.state.mentor.service.map(el => (
                  <div className="service-border" style={backimgstyle}>
                    <div className="service-item" >
                      <div className="service-title">
                        <div className="service-name">{el.name}</div>
                        <div className="service-price">{el.price+' USD'}</div>
                      </div>
                      <div className="service-description">{el.description}</div>
                      <div className="buy-button"><Button className="buy-button-ani" onClick={()=>this.initBuy(el.name, el.price)}>购买</Button></div>
                    </div>
                  </div>

                )

              )}
              </div>
            </div>
            ) : (
            <div className="para-large">
              <b>{this.state.mentor.last+this.state.mentor.first}</b>
              本周尚未提供服务
            </div>
          )
        }



        <div className="detail-section">
            <div className="title">
                过往评价
            </div>

          <CommentBox user={this.props.user} mentor={this.state.mentor} mid={this.props.match.params.mid} displayCommentReplyButton={true}/>
        </div>
      </div>


    );
  }
}

MentorDetail.contextTypes = {
    router: PropTypes.object
};

export default MentorDetail;
