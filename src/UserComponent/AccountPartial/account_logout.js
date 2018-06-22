import React from 'react';
import store from "../../redux";
import {logout} from "../../redux/userAction";
import {withRouter} from "react-router-dom";

class AccountLogout extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch(logout());
    this.props.history.push("/");
  }

  render() {
    return (
      <div/>
    );
  }
}


export default withRouter(AccountLogout);
