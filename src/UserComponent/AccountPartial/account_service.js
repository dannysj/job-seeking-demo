import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import axios from 'axios';
import '../account.less';
import {NotificationManager} from 'react-notifications';

class AccountService extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        loaded: [],
        mentees: []
      };

    this.updateInfo = this.updateInfo.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDecision = this.handleDecision.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    //this.updateInfo();
  }
/*  componentDidMount() {
    //FIXME:

    let list = this.props.mentees.map((e) => {
    //let list = this.state.mentees.map((e) => {
      return e.id;
    })
    this.setState({loaded: list});
  }*/

  updateInfo(){
    var handler = this;
    console.log(this.props.user.access_token);
    axios.post('/api/get_rel_mentees', {}, {headers:{access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code === 0){
        let list = res.data.mentees.map((e) => {
          return e.id;
        })
        handler.setState({mentees:res.data.mentees, loaded: list});
      }
      else{
        // TODO: error handling
        NotificationManager.error('数据库错误','错误');
        console.log(res.data);
      }
    });
  }

  handleImageLoaded(index) {
    let loaded = this.state.loaded;
    let newLoaded = loaded.filter(e => e !== index)
    this.setState({ loaded: newLoaded });

  }

  handleConfirm(mrid){
    var handler = this;
    axios.post('/api/mentor_confirm',{mrid: mrid}, {headers: {access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        handler.updateInfo();
      }
      else{
        // TODO: error handling
        NotificationManager.error('数据库错误','错误');
        console.log(res.data);
      }
    });
  }

  handleDecision(mrid, agreed){
    var handler = this;
    axios.post('/api/mentor_decision', {mrid: mrid, agreed: agreed}, {headers:{access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        window.location.reload(); // TODO: the reason I used reload here is because
                                  // this.updateInfo only updates the page content
                                  // it doesn't update the number of unread system messages
                                  // we need to change to a decent way of doing this
      }
      else{
        // TODO: error handling
        NotificationManager.error('数据库错误','错误');
        console.log(res.data);
      }
    });
  }


    render() {
        return(
          <div className="account-inner-spacing">
            <div className="category last">
              <div className="item first">
              <div className="content">
              <div className="inner-content service-card-container">
              {this.state.mentees.length===0 && '您暂时并无Mentee签约'}
              {this.state.mentees.map(el => (
                <div className="app-mentor-container" key={el.id}>
                  <div className="mentee-top">
                  <div className="info">
                    <div className="name">{el.last+' '}{el.first}</div>
                    <div>{el.email}</div>
                    <div>{el.status===20?'等待您通过申请':el.status==50?'已被您拒绝':el.status===1?'请联系Mentee并开始服务，服务完成后点击确认完成':el.status===2?'等待Mentee确认服务完成':'服务完成'}</div>

                  </div>
                  <div className={((this.state.loaded.indexOf(el.id) == -1) ? "" : "app-mentor-picture on-load circular")}>
                  <img className="app-mentor-picture" src={el.profile_pic} alt={el.last + ' ' + el.first} onLoad={() => {this.handleImageLoaded(el.id)}}/>
                  </div>
                  </div>
                  <div className="app-mentor-text">

                    <p>{el.note}</p>
                  </div>
                  <div className="button-group">
                  <Link to={'/user/'+el.uid}><Button floated='right'>查看资料</Button></Link>
                  {el.status===20 && (<div>
                    <Button floated='right' positive onClick={() => this.handleDecision(el.mrid, 1)}>通过申请</Button>
                    <Button floated='right' negative onClick={() => this.handleDecision(el.mrid, 0)}>拒绝申请</Button>
                  </div>)}
                  {el.status===1 && <Button floated='right' positive onClick={() => this.handleConfirm(el.mrid)}>确认完成</Button>}
                  {el.status===2 && <Button floated='right' disabled>等待Mentee确认</Button>}
                  {el.status===3 && <Button floated='right' disabled>服务完成</Button>}
                </div>
                </div>
              ))}
              </div>
            </div>
            </div>
          </div>
          </div>
        );
    }
}

AccountService.contextTypes = {
    router: PropTypes.object
};

export default AccountService;
