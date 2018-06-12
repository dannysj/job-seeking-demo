import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'semantic-ui-react';
import axios from 'axios';
import '../account.css';

class AccountForbidden extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="forbidden-content">
        您的账户尚未激活，请查看您的邮件并根据提示验证邮箱
      </div>
    );
  }
}

AccountForbidden.contextTypes = {
  router: PropTypes.object
};

export default AccountForbidden;
