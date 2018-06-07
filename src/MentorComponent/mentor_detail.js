import React, {Component} from 'react';
import axios from 'axios';
import {Button, Image, Divider, Icon} from 'semantic-ui-react';
import Disqus from './disqus.js';
import PropTypes from 'prop-types';
import './mentor.css';

class MentorDetail extends Component {

  constructor (props) {
    super(props);
    this.state={mentor:{first:"我的天", last:"噢", english:"my god", bio:"HIHIHI i am dasdfasdfas fasdsfasdfa asdfasdfasfdf asdfasf",college_name:"Uni of WCDSF", offer_company:"Lucid", offer_title:"Test",
    service:[{
      name: "简历修改",
      price: "100",
      description: "我帮你改简历，你给我钱，ok?",
    },
    {
      name: "Test",
      price: "100",
      description: "Hey whatcha yoi doing?",
    },
    {
      name: "Test",
      price: "100",
      description: "Hey whatcha yoi doing?",
    },
    {
      name: "Test",
      price: "100",
      description: "Hey whatcha yoi doing?",
    }
  ]}, showAddServiceModal: false};
/*
    axios.post('/api/get_mentor_detail',{mid:this.props.match.params.mid}).then(res => {
      if(res.data.code===0){
        console.log(res.data.mentor);
        this.setState({mentor:res.data.mentor});
      }
      else{
        //TODO: Error Handling
      }
    });
*/
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
        // handler.setState({showAddServiceModal: true, qr_code: 'https://pan.baidu.com/share/qrcode?w=280&h=280&url='+res.data.qr_code});
        // handler.pollPayment(res.data.order_id);
        window.location.href = res.data.url;
        // window.open(res.data.url,"Paypal", "width=800,height=1200");
      }
      else{
        //TODO: Error Handling
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

  // {this.props.match.params.mid}

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


      return (
      <div className="mentor-detail-container">
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
              <div className="small-bio" dangerouslySetInnerHTML={{__html:this.state.mentor.bio}}>

              </div>
            </div>
          </div>
        </div>
        <div className="mentor-detail-info-container">

          <div className="item detail-item">
            <Icon name='graduation cap' />
            <div className="title">
              在读院校
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.college_name}}>
            </div>
          </div>
          <div className="item detail-item">
            <Icon name='pin' />
            <div className="title">
              offer公司
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.offer_company}}>
            </div>

          </div>

          <div className="item detail-item">
            <Icon name='fax' />
            <div className="title">
              offer职位
            </div>
            <div className="subtitle" dangerouslySetInnerHTML={{__html:this.state.mentor.offer_title}}>
            </div>

          </div>

          <div className="item detail-item">
            <Icon name='male' />
            <div className="title">
              年龄
            </div>
            <div className="subtitle">{parseInt((new Date() - new Date(this.state.mentor.dob))/(365*24*3600*1000))}</div>

          </div>

        </div>

        <div className="mentor-service-overview detail-section">
          <div className="title">
            服务介绍

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
                  <div className="buy-button"><Button positive onClick={()=>this.initBuy(el.name, el.price)}>购买</Button></div>
                </div>
              </div>

            )
          )}
          </div>
        </div>

        <div className="detail-section">
          <div className="title">
              简历
            </div>
          <embed className="resume-holder" src={this.state.mentor.resume} width="100%" type='application/pdf'/>
        </div>

        <div className="detail-section">
          <h2 className="ui header">
            <i className="comment alternate outline icon"/>
            <div className="content">
                过往评价
                <Disqus id={this.state.mentor.id}
                        title={this.state.mentor.id}
                        path={"/mentor" + this.state.mentor.id}
                />
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
