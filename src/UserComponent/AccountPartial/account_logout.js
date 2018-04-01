import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Input, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AccountLogout extends React.Component {
  constructor(props) {
    super(props);
    localStorage.removeItem('uid');
    window.location.href('/');
  }
    render() {
        return(
          <div>
          </div>
        );
    }
}

AccountLogout.contextTypes = {
    router: PropTypes.object
};

export default AccountLogout;
