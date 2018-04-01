import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import '../account.css';

class AccountService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


    render() {
        return(
          <div>
            <h4>我的订单</h4>
            
          </div>
        );
    }
}

AccountApply.contextTypes = {
    router: PropTypes.object
};

export default AccountApply;
