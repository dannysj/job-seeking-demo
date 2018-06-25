import React from 'react';
import { Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AccountBalance extends React.Component {
    render() {
        return(
          <div className="account-inner-spacing">
            <div className="category">
            <h4>您当前可用余额为：¥ <b>{this.props.user.balance}</b></h4>
            <br />
            <Button positive>提现</Button>
            </div>
          </div>
        );
    }
}

AccountBalance.contextTypes = {
    router: PropTypes.object
};

export default AccountBalance;
