import React from 'react';
import PropTypes from 'prop-types';
import '../account.less';
import { Button} from 'semantic-ui-react';
import axios from 'axios'

class AccountForbidden extends React.Component {
  constructor(props) {
    super(props);
    this.handleResend = this.handleResend.bind(this);
  }

  handleResend = () => {
    axios.post("/api/resend_verification_code");
  };

  render() {
    return (
      <div className="forbidden-content">
        <div>您的账户尚未激活，请查看您的邮件并根据提示验证邮箱</div>
        <Button primary onClick={this.handleResend}>重发激活邮件</Button>
      </div>
    );
  }
}

AccountForbidden.contextTypes = {
  router: PropTypes.object
};

export default AccountForbidden;
