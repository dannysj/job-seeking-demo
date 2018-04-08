import React from 'react';
import PropTypes from 'prop-types';

class AccountLogout extends React.Component {
  constructor(props) {
    super(props);
    this.setState({user: null});
    localStorage.removeItem('uid');
    window.location.href = '/';
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

AccountLogout.contextTypes = {
  router: PropTypes.object
};

export default AccountLogout;
