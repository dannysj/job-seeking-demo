import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import store from "../../redux";
import {updateUser} from "../../redux/userAction";
import {NotificationManager} from 'react-notifications';
import NotificationContainer from "./Component/NotificationContainer";

class AccountNotification extends React.Component {
  state = {
    messages: []
  };

  componentWillMount(){
    this.retrieveMessage();
  }

  retrieveMessage(){
    axios.post('/api/get_system_notifications', {}, {headers:{access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code === 0){

        this.setState({messages:res.data.messages});
      }
      else{
        // TODO: error handling
        NotificationManager.error('数据库错误','错误');
        console.log(res.data);
      }
    });

    axios.post('/api/read_system_notification', {}, {headers:{access_token: this.props.user.access_token}}).then(res => {
      if(res.data.code === 0){
        store.dispatch(updateUser('num_notifications', 0, {local: true}));
      }
    });
  }

  render() {
    return(
      <div className="account-inner-spacing">
        <NotificationContainer messages={this.state.messages}/>
      </div>
    );
  }
}

AccountNotification.contextTypes = {
    router: PropTypes.object
};

export default AccountNotification;
