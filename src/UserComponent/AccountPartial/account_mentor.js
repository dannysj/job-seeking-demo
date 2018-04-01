import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Input, Segment } from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

class AccountMentor extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        mentors: []
      };

    var handler = this;
    axios.post('http://localhost:3005/api/get_rel_mentors', {uid: this.props.user.id}).then(res => {
      if(res.data.code == 0){
        console.log(res.data);
        handler.setState({mentors:res.data.mentors});
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });
  }

  handleConfirm(mid) {
    axios.post('http://localhost:3005/api/mentee_confirm', {uid: this.props.user.id, mid: mid}).then(res => {
      if(res.data.code == 0){
        console.log(res.data);
        this.context.router.history.push('/account/mentor');
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
          <div>
            {this.state.mentors.length==0 && '您暂时并无导师签约'}
            {this.state.mentors.map(el => (
              <div className="app-mentor-container" key={el.id}>
                <img className="app-mentor-picture" src={el.profile_pic}></img>
                <div className="app-mentor-text">
                  <h4>{el.last+' '}{el.first}</h4>
                  <p>Offer: {el.offer_company+' '+el.offer_title}</p>
                  <p>院校: {el.college_name}</p>
                  <p>Email: {el.email}</p>
                  <p>签约状态: {el.status==1?'正在服务':el.status==2?'等待您确认服务完成':'服务完成'}</p>
                </div>
                {el.status==1 && <Button floated='right' disabled>服务进行中</Button>}
                {el.status==2 && <Button floated='right' positive onClick={() => this.handleConfirm(el.mid)}>确认完成</Button>}
                {el.status==3 && <Button floated='right' onClick={() => this.handleAppDecision(el.uid, el.mid, false)}>评价导师</Button>}
              </div>
            ))}
          </div>
        );
    }
}

AccountMentor.contextTypes = {
    router: PropTypes.object
};

export default AccountMentor;
