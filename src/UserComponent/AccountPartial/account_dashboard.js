import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Dashboard from './Component/Dashboard';
import axios from 'axios';
import '../account.less';
import {NotificationManager} from "react-notifications";

class AccountDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        news: { content: '' , thumbnail: '' },
        applications: [],
        loaded: []
      };

  }



  render() {
    if(!this.props.user.isadmin){
      return (<h1>您没有权限访问本页，别给老子瞎搞</h1>);
    }
    return(
      <div className="account-inner-spacing">
        <Dashboard />
      </div>
    );
  }
}

AccountDashboard.contextTypes = {
    router: PropTypes.object
};

export default AccountDashboard;
