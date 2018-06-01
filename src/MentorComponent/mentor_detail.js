import React, {Component} from 'react';
import axios from 'axios';
import {Button, Image} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import './mentor.css';
import CommentBox from "./CommentBox";

class MentorDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {mentor: {first: "", last: "", service: []}, showAddServiceModal: false};

    axios.post('/api/get_mentor_detail',{mid:this.props.match.params.mid}).then(res => {
      if(res.data.code===0){
        this.setState({mentor:res.data.mentor});
      }
      else{
        NotificationManager.error('无法获得Mentor信息', '错误');
      }
    });

    this.initBuy = this.initBuy.bind(this);
  }

  initBuy(service_name, service_price){
    if(!this.props.user){
      this.context.router.history.push('/login');
      return;
    }
    var handler = this;
    axios.post('/api/create_order',
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
    axios.post('/api/poll_payment',
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
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }


      return (
      <div className="mentor-detail-container">
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

        <div className="ui grid">
          <div className="six wide column">
              <img className="mentor-img" src={this.state.mentor.profile_pic}/>
          </div>
          <div className="ten wide column">
            <h2 className="ui header">
                <i className="address card icon"/>
              <div className="content">
                导师介绍
                <div className="sub header">{this.state.mentor.last+this.state.mentor.first}的详细资料</div>
              </div>
            </h2>
            <div>
              <p><b>在读院校：</b>{this.state.mentor.college_name}</p>
              <p><b>offer公司：</b>{this.state.mentor.offer_company}</p>
              <p><b>offer职位：</b>{this.state.mentor.offer_title}</p>
              <p><b>年龄：</b>{parseInt((new Date() - new Date(this.state.mentor.dob))/(365*24*3600*1000))}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
              <i className="id badge outline icon"/>
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
              <i className="calendar outline icon"/>
            <div className="content">
              服务介绍
              <div className="sub header">具体服务范围</div>
            </div>
          </h2>
          <p>
            <b>{this.state.mentor.last+this.state.mentor.first}</b>
            本周还可提供{this.state.mentor.num_availability}次服务
          </p>
          <table class="ui celled table">
            <thead>
              <tr><th>服务名称</th>
              <th>服务价格</th>
              <th>具体介绍</th>
              <th></th>
            </tr></thead>
            <tbody>
              {
                this.state.mentor.service.map(el => (
                  <tr>
                    <td>{el.name}</td>
                    <td>{el.price+' USD'}</td>
                    <td>{el.description}</td>
                    <td><Button positive onClick={()=>this.initBuy(el.name, el.price)}>免费试用</Button></td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="file alternate outline icon"/>
            <div className="content">
              简历
            </div>
          </h2>
          <embed className="resume-holder" src={this.state.mentor.resume} width="100%" type='application/pdf'/>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="comment alternate outline icon"/>
            <div className="content">
                过往评价
            </div>
          </h2>
          <CommentBox user={this.props.user} mid={this.props.match.params.mid} displayCommentReplyButton={true}/>
        </div>
      </div>


    );
  }
}

MentorDetail.contextTypes = {
    router: PropTypes.object
};

export default MentorDetail;
