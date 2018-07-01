import React from 'react';
import PropTypes from 'prop-types';
import '../account.less';

class AccountForbidden extends React.Component {
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
