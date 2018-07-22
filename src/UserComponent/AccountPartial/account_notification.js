import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import store from "../../redux";
import {updateUser} from "../../redux/userAction";
import NotificationContainer from "./Component/NotificationContainer";
import {getAuthHeader} from "../../utils";

class AccountNotification extends React.Component {
  state = {
    messages: []
  };

  componentWillMount(){
    this.retrieveMessage();
  }

  retrieveMessage(){
    axios.post('/api/get_system_notifications', {}, getAuthHeader()).then(res => {
      this.setState({messages: res.data.messages});
    });

    axios.post('/api/read_system_notification', {}, getAuthHeader()).then(res => {
      store.dispatch(updateUser('num_notifications', 0, {local: true}));
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
