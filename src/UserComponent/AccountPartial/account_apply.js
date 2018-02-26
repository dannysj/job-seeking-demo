import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountApply extends React.Component {
    render() {
        return(
          <div>
            <h4>申请成为导师</h4>
          </div>
        );
    }
}

AccountApply.contextTypes = {
    router: PropTypes.object
};

export default AccountApply;
