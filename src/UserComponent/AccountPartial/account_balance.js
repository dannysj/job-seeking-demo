import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Image, Header, Input, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AccountBalance extends React.Component {
    render() {
        return(
          <div className="account-inner-spacing">
            <h4>您当前可用余额为：¥ <b>{this.props.user.balance}</b></h4>
            <br />
            <Button positive>提现</Button>
          </div>
        );
    }
}

AccountBalance.contextTypes = {
    router: PropTypes.object
};

export default AccountBalance;
