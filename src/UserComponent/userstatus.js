import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { Icon} from 'semantic-ui-react';
import './userstatus.less';
import {userStatus} from "../redux/userReducer";

class UserStatus extends Component {

  render() {
    if(this.props.user.status === userStatus.login){
      return (
        <div className="right-menu" onClick={this.props.onClick}>

              <label className="user-inline" forname={this.props.passFor}>
                <div className="chinese-top">
                我的账号
                  {
                    (!isNaN(this.props.user.num_notifications) && this.props.user.num_notifications!==0) &&
                      ('('+this.props.user.num_notifications+'条未读通知)')
                  }
                </div>
                <img className="ui mini circular image" src={this.props.user.profile_pic} alt="Profile"/>
              </label>

        </div>
      );
    }
    return (
      <div className="right-menu">
        <div className="large-screen">
        <div className="item">
          <Link className="item" to="/login">
              登陆
          </Link>
        </div>
        <div className="item">
          <Link className="item" to="/signup">
              注册
          </Link>
        </div>
        </div>
        <div className="small-screen">
          <div className="item">
            <Link to="/login">
            <label forname={this.props.passFor}>
              <div>
              <Icon name='user circle' color="blue" size='big' />
              </div>
              </label>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default UserStatus;
