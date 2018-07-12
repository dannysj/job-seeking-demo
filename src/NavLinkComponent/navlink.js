import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './navlink.less';

class NavLink extends React.Component {
  static propTypes = {
    isHorizontal: PropTypes.bool
  };

  render() {
    const isActive = this.context.router.route.location.pathname === this.props.to;
    let className = 'item ';

    if (!this.props.isHorizontal) {
      className += isActive ? 'vertical-col ' : ' ';
    } else {
      className += isActive ? 'active-custom ' : ' ';
    }

    return (
      <Link className={className} {...this.props}>
        {this.props.children}
      </Link>
    );
  }
}

NavLink.contextTypes = {
  router: PropTypes.object
};


export default NavLink;
