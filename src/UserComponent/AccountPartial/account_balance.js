import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountBalance extends React.Component {
    render() {
        return(
          <div>
            <h4>您当前可用余额为：$ <b>0.00</b></h4>
            <br />
            <h4>充值：</h4>
            <h4>您可用的支付方式：</h4>
            <h4>添加新的支付方式：</h4>
          </div>
        );
    }
}

AccountBalance.contextTypes = {
    router: PropTypes.object
};

export default AccountBalance;
