import React from 'react';
import { Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AccountBalance extends React.Component {
    render() {
        return(
          <div className="account-inner-spacing">
            <div className="category last">
            <div className="item first">
            <div className="content">
            <div className="inner-content">
            <div className="subheader">您当前可用余额为</div>
            <div className="header">¥ <b>{this.props.user.balance}</b></div>
            <br />
            <Button positive>提现</Button>
            </div>
            </div>
            </div>
            </div>
          </div>
        );
    }
}

AccountBalance.contextTypes = {
    router: PropTypes.object
};

export default AccountBalance;
