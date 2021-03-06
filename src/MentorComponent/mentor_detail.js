import React, {Component} from 'react';
import axios from 'axios';
import {Button, Header, Icon, Image, Input, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {NotificationManager} from 'react-notifications';
import './mentor.less';
import CommentBox from "./CommentBox";
import Arrow from "../Components/Arrow";
import Footer from '../Components/Footer';
import {connect} from 'react-redux'
import store from "../redux";
import {fetchMentorDetail} from "../redux/mentorDetailAction";
import {getAuthHeader} from "../utils";
import Loading from "../Components/Loading";

class MentorDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      is_resume_open:false,
      isDown:true,
      note: '',
      showAddServiceModal: false,
      showNoteModal: false
    };
    this.timer = null

    this.initBuy = this.initBuy.bind(this);
    this.resumeToggled = this.resumeToggled.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelBuy = this.handleCancelBuy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.handleCompanyIconError = this.handleCompanyIconError.bind(this);
    this.handleCompanyIconLoad = this.handleCompanyIconLoad.bind(this);
  }

  componentWillMount(){
    store.dispatch(fetchMentorDetail(this.props.match.params.mid));
  }


  handleCompanyIconError (e) {
    e.preventDefault();
    e.target.style.display = 'none';
  }

  handleCompanyIconLoad (e) {
    e.preventDefault();
    e.target.style.display = 'block';
  }

  updateNote(e) {
    this.setState({note: e.target.value});
  }

  handleSubmit() {
    this.setState({showNoteModal: false})
    axios.post('/api/create_order',
    {
      mid:this.props.match.params.mid,
      service_name: this.state.service_name,
      service_price: this.state.service_price,
      note: this.state.note
    }, getAuthHeader()).then(res => {
        window.location.href = res.data.url;
    });
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
    if(!this.props.user.wechat){
      NotificationManager.error('请先在个人资料中填好您的微信号', '错误');
      return;
    }
    const mentor = this.props.mentorDetailStore[this.props.match.params.mid];
    if(!(mentor.num_availability >= 1)){
      NotificationManager.error('该Mentor本周服务已被订满', '错误');
      return;
    }
    this.setState({service_name: service_name, service_price: service_price, showNoteModal: true});
  }

  handleCancelBuy() {
    this.setState({service_name: '', service_price: '', note: '', showNoteModal: false});
  }

  pollPayment(order_id){
    var handler = this;
    axios.post('/api/poll_payment',
    {
      order_id:order_id
    }, {headers: {access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code===0){
        // handler.setState({showAddServiceModal: false, qr_code: ''});
        NotificationManager.success('支付成功','成功');
        this.context.router.history.push('/account/mentor');
      }
      else if(res.data.code === 15){
        handler.pollPayment(order_id);
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  	stop() {
  		clearTimeout(this.timer);
  	}
  	scrollTo(id, callback) {
  		var settings = {
  			duration: 1000,
  			easing: {
  				outQuint: function (x, t, b, c, d) {
  					return c*((t=t/d-1)*t*t*t*t + 1) + b;
  				}
  			}
  		};
  		var percentage;
  		var startTime;
  		var node = document.getElementById(id);
  		var nodeTop = node.offsetTop - 65;
  		var nodeHeight = node.offsetHeight;
  		var body = document.body;
  		var html = document.documentElement;
  		var height = Math.max(
  			body.scrollHeight,
  			body.offsetHeight,
  			html.clientHeight,
  			html.scrollHeight,
  			html.offsetHeight
  		);
  		var windowHeight = window.innerHeight
  		var offset = window.pageYOffset ;
  		var delta = nodeTop - offset;
  		var bottomScrollableY = height - windowHeight;
  		var targetY = (bottomScrollableY < delta) ?
  			bottomScrollableY - (height - nodeTop - nodeHeight + offset):
  			delta;

  		startTime = Date.now();
  		percentage = 0;

  		if (this.timer) {
  			clearInterval(this.timer);
  		}

  		function step () {
  			var yScroll;
  			var elapsed = Date.now() - startTime;

  			if (elapsed > settings.duration) {
  				clearTimeout(this.timer);
  			}

  			percentage = elapsed / settings.duration;

  			if (percentage > 1) {
  				clearTimeout(this.timer);

  				if (callback) {
  					callback();
  				}
  			} else {
  				yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
  				window.scrollTo(0, yScroll);
  				this.timer = setTimeout(step, 10);
  			}
  		}

  		this.timer = setTimeout(step, 10);
  	}

  render() {

    const mentor = this.props.mentorDetailStore[this.props.match.params.mid];

    if (!mentor)
      return (<Loading/>);

    let modalClassName='ui modal';
    const backimgstyle = {
      backgroundImage: 'url('+mentor.profile_pic+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      filter:'blur(1em)',
      };
    if(this.state.showAddServiceModal){
      modalClassName += ' payment-qr-container';
    }

    const companyIcon = '/icons/company.png'
    const schoolIcon = '/icons/school.png'
    const posiIcon = '/icons/position.png'
    const ageIcon = '/icons/age.png'



    let paragraphs = []

    if (mentor.bio) {
      paragraphs = mentor.bio.split(/[\n\r]+/g) || []

    }
    paragraphs = paragraphs.map((text, i) => {
      return (
          <p key={i}>
            {text}
          </p>
      );
    });
      return (
      <div className="mentor-detail-container">

        <Modal open={this.state.showNoteModal} style={{
          marginTop: '0px !important',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <Header icon='archive' content='申请导师服务' />
          <Modal.Content>
            <p>
              请为导师提供一小段cover letter
            </p>
            <Input placeholder='说点什么吧' fluid value={this.state.note} onChange={this.updateNote} />
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.handleCancelBuy}>
              <Icon name='remove' /> 取消
            </Button>
            <Button color='green' onClick={this.handleSubmit}>
              <Icon name='checkmark' /> 确认
            </Button>
          </Modal.Actions>
        </Modal>
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

        <div className="mentor-background-image-container" >
        <div className="mentor-background-image" style={backimgstyle}></div>
          <div className="mentor-sep-container">
            <div className="header">
              <div className="mentor-profile-border">
                <img src={mentor.profile_pic}></img>
              </div>
              <div className="border-navi">
                <div className="timeline-marker"></div>
                <div className="item" onClick={() => {this.scrollTo("info")}}><Icon name='leaf' /><div className="navi-title">个人资料</div></div>
                <div className="item" onClick={() => {this.scrollTo("info")}}><Icon name='pencil' /><div className="navi-title">阅历</div></div>
                <div className="item" onClick={() => {this.scrollTo("resume")}}><Icon name='address card' /><div className="navi-title">简历</div></div>
                <div className="item" onClick={() => {this.scrollTo("service")}}><Icon name='star' /><div className="navi-title">服务介绍</div></div>
                <div className="item" onClick={() => {this.scrollTo("comment")}}><Icon name='talk' /><div className="navi-title">评价</div></div>
              </div>
            </div>
            <div className="subheader">
              <div className="mentor-name">
                <div className="chinese-top">{mentor.last+mentor.first}</div>
                <div className="divider"></div>
                <div className="App-subtitle">
                  <img
                    style={{width:'50px',height:'50px'}}
                    src={'/files/'+mentor.offer_company.replace(/\s+/g,'').toLowerCase()+'.jpg'}
                    onError={this.handleCompanyIconError}
                    onLoad={this.handleCompanyIconLoad}/>
                </div>
              </div>
              <div className="small-bio">
              {paragraphs}
              </div>

            </div>
          </div>
        </div>
        <div id="info" className="mentor-detail-info-container">

          <div className="item detail-item">

            <div className="title">
            <img className="title-icon" alt="school" src={schoolIcon} height={50}/>
              在读院校
            </div>
            <div className="subtitle">
              {mentor.college_name}
            </div>
          </div>
          <div className="item detail-item">

            <div className="title">
            <img className="title-icon" alt="company" src={companyIcon} height={50}/>
              offer公司
            </div>
            <div className="subtitle">
              {mentor.offer_company}
            </div>

          </div>

          <div className="item detail-item">

            <div className="title">
              <img className="title-icon"  alt="position" src={posiIcon} height={50}/>
              offer职位
            </div>
            <div className="subtitle">
              {mentor.offer_title}
            </div>

          </div>

          <div  className="item detail-item">

            <div className="title">
              <img className="title-icon"  alt="age" src={ageIcon} height={50}/>
              本周服务次数
            </div>
            <div className="subtitle">{
              (mentor.num_availability>=0) ? mentor.num_availability : 0
            }</div>

          </div>

        </div>

        <div id="resume" className="detail-section resume-section" style={{height:this.state.is_resume_open?'90vh':'50vh'}}>
          <div className="title">
              简历
            </div>
          <embed className="resume-holder" src={mentor.resume} width="100%" type='application/pdf'/>
          <label forName="reveal-resume" className="resume-name" onClick={this.resumeToggled}><span>{(this.state.isDown) ? "点\xa0\xa0\xa0\xa0击\xa0\xa0\xa0\xa0展\xa0\xa0\xa0\xa0开\xa0\xa0\xa0\xa0简\xa0\xa0\xa0\xa0历" : "缩\xa0\xa0\xa0\xa0小"}</span><span className="triangle-open"><Arrow isDown={this.state.isDown}/></span>
          </label>
        </div>

          {
            (mentor.service.length > 0) ? (
              <div id="service" className="mentor-service-overview detail-section">
                <div className="title">
                  服务介绍

                </div>
              <div className="para-medium">
                <b>{mentor.last+mentor.first}</b>
                本周还可提供{
                  (mentor.num_availability>=0) ? mentor.num_availability : 0
                }次服务
              </div>
              <div className="mentor-service-container">
              {
                mentor.service.map(el => (
                  <div className="service-border" >
                    <div className="service-blur" style={backimgstyle}> </div>
                    <div className="service-item" >
                      <div className="service-title">
                        <div className="service-name">{el.name}</div>
                        <div className="service-price">{el.price+' USD'}</div>
                      </div>
                      <div className="service-description">{el.description}</div>
                      <div className="buy-button"><Button className="buy-button-ani" onClick={()=>this.initBuy(el.name, el.price)}>免费体验</Button></div>
                    </div>
                  </div>

                )

              )}
              </div>
            </div>
            ) : (
            <div id="service" className="para-large">
              <b>{mentor.last+mentor.first}</b>
              本周尚未提供服务
            </div>
          )
        }



        <div id="comment" className="detail-section">
            <div className="title">
                过往评价
            </div>

          <CommentBox user={this.props.user} mentor={mentor} displayCommentReplyButton/>
        </div>

        <Footer />
      </div>


    );
  }
}

MentorDetail.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
  const {mentorDetailStore} = state;
  return {mentorDetailStore};
};

export default connect(mapStateToProps)(MentorDetail);
