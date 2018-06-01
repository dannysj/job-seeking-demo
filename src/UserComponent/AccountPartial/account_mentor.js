import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import CommentBox from "../../MentorComponent/CommentBox";

class AccountMentor extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        mentors: []
      };

    this.updateInfo();
  }

  updateInfo(){
    let handler = this;
    axios.post('/api/get_rel_mentors', {uid: this.props.user.id}).then(res => {
      if(res.data.code === 0){
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
    let handler = this;
    axios.post('/api/mentee_confirm', {uid: this.props.user.id, mid: mid}).then(res => {
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


    render() {
        return(
          <div>
            {this.state.mentors.length===0 && '您暂时并无导师签约'}
            {this.state.mentors.map(el => (
              <div className="app-mentor-container" key={el.id}>
                <img className="app-mentor-picture" src={el.profile_pic}/>
                <div className="app-mentor-text">
                  <h4>{el.last+' '}{el.first}</h4>
                  <p>Offer: {el.offer_company+' '+el.offer_title}</p>
                  <p>院校: {el.college_name}</p>
                  <p>Email: {el.email}</p>
                  <p>签约状态: {el.status==1?'正在服务':el.status==2?'等待您确认服务完成':'服务完成'}</p>
                </div>
                {el.status==1 && <Button floated='right' disabled>服务进行中</Button>}
                {el.status==2 && <Button floated='right' positive onClick={() => this.handleConfirm(el.mid)}>确认完成</Button>}
                {el.status==3 && <Button floated='right'>评价导师</Button> }
                {el.status==3 && <CommentBox className="comment-box" user={this.props.user} mid={el.id} hideComment={true}/>}
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
