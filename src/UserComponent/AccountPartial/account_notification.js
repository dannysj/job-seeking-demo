import React from 'react';
import {Button, Image, Segment} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import MessageBox from './message_box';
import CommentBox from "../../MentorComponent/CommentBox";
import NavLink from '../../NavLinkComponent/navlink';

class AccountNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state =
    {
      messages: []
    };

    this.retrieveMessage();
  }

  retrieveMessage(){
    axios.post('/api/get_system_notifications', {uid: this.props.user.id}).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        this.setState({messages:res.data.messages});
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });

    axios.post('/api/read_system_notification', {uid: this.props.user.id}).then(res => {
      if(res.data.code == 0){
        this.props.user.num_notifications = 0;
        this.props.onUpdate(this.props.user);
      }
    });
  }


  render() {
    return(
      <div>
        {this.state.messages.map(el=>(
          <Segment>
            <Image avatar src='/img/icon.png' />
            系统通知：{new Date(el.timestamp).toLocaleTimeString()}
            <br />
            <div className="bio-display">
              {el.content}
            </div>
          </Segment>
        ))}
      </div>
    );
  }
}

AccountNotification.contextTypes = {
    router: PropTypes.object
};

export default AccountNotification;
