import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class AccountMentor extends React.Component {
    render() {
        return(
          <div>您暂时并无导师签约</div>
        );
    }
}

AccountMentor.contextTypes = {
    router: PropTypes.object
};

export default AccountMentor;
