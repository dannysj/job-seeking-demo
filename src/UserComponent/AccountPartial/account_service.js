import React from 'react';
import PropTypes from 'prop-types';
import { Button} from 'semantic-ui-react';
import axios from 'axios';
import '../account.css';

class AccountService extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        mentees: []
      };

    this.updateInfo();
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDecision = this.handleDecision.bind(this);
  }

  updateInfo(){
    var handler = this;
    axios.post('/api/get_rel_mentees', {access_token: this.props.user.access_token}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        handler.setState({mentees:res.data.mentees});
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });
  }

  handleConfirm(mentee_uid){
    var handler = this;
    axios.post('/api/mentor_confirm', {access_token: this.props.user.access_token, mentee_uid: mentee_uid}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        handler.updateInfo();
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });
  }

  handleDecision(mentee_uid, agreed){
    var handler = this;
    axios.post('/api/mentor_decision', {access_token: this.props.user.access_token, mentee_uid: mentee_uid, agreed: agreed}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        window.location.reload(); // TODO: the reason I used reload here is because
                                  // this.updateInfo only updates the page content
                                  // it doesn't update the number of unread system messages
                                  // we need to change to a decent way of doing this
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });
  }


    render() {
        return(
          <div className="account-inner-spacing">
            <div>
              {this.state.mentees.length===0 && '您暂时并无Mentee签约'}
              {this.state.mentees.map(el => (
                <div className="app-mentor-container" key={el.id}>
                  <img className="app-mentor-picture" src={el.profile_pic} alt={el.last + ' ' + el.first}/>
                  <div className="app-mentor-text">
                    <h4>{el.last+' '}{el.first}</h4>
                    <p>Email: {el.email}</p>
                    <p>签约状态: {el.status===20?'等待您通过申请':el.status==50?'已被您拒绝':el.status===1?'请联系Mentee并开始服务，服务完成后点击确认完成':el.status===2?'等待Mentee确认服务完成':'服务完成'}</p>
                  </div>
                  {el.status===20 && (<div>
                    <Button floated='right' positive onClick={() => this.handleDecision(el.uid, 1)}>通过申请</Button>
                    <Button floated='right' negative onClick={() => this.handleDecision(el.uid, 0)}>拒绝申请</Button>
                  </div>)}
                  {el.status===1 && <Button floated='right' positive onClick={() => this.handleConfirm(el.uid)}>确认完成</Button>}
                  {el.status===2 && <Button floated='right' disabled>等待Mentee确认</Button>}
                  {el.status===3 && <Button floated='right' disabled>服务完成</Button>}
                </div>
              ))}
            </div>
          </div>
        );
    }
}

AccountService.contextTypes = {
    router: PropTypes.object
};

export default AccountService;
