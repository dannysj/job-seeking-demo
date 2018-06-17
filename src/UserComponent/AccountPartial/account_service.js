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
  }

  updateInfo(){
    var handler = this;
    axios.post('/api/get_rel_mentees', {uid: this.props.user.id}).then(res => {
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
    axios.post('/api/mentor_confirm', {uid: this.props.user.id, mentee_uid: mentee_uid}).then(res => {
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
          <div className="account-inner-spacing">
            <div>
              {this.state.mentees.length===0 && '您暂时并无Mentee签约'}
              {this.state.mentees.map(el => (
                <div className="app-mentor-container" key={el.id}>
                  <img className="app-mentor-picture" src={el.profile_pic} alt={el.last + ' ' + el.first}/>
                  <div className="app-mentor-text">
                    <h4>{el.last+' '}{el.first}</h4>
                    <p>Email: {el.email}</p>
                    <p>签约状态: {el.status===1?'请联系Mentee并开始服务，服务完成后点击确认完成':el.status===2?'等待Mentee确认服务完成':'服务完成'}</p>
                  </div>
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
