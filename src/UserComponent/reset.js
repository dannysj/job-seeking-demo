import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './user.less';

class Reset extends Component {

  constructor(props) {
    super(props);
    this.state = {email: null, success: false};
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/forget_password', {email: this.state.email}).then(res => {
      this.setState({success: true});
    })
  };

  handleChange = (e) => {
    this.setState({email: e.target.value});
  };

  render() {
    return (
      <div className="login-signup-container">
        {
          (this.state.success) ? (
            <div className="small-title">重置密码链接已发送到您邮件。请查收😛</div>
          ) : (<div>
              <div className="small-title">忘了登入密码？</div>
              <form className="ui form" onSubmit={this.handleSubmit}>
                <div className="field">
                  <label>请输入Email</label>
                  <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required/>
                </div>
                <button className="ui button" type="submit">发送重设密码链接</button>
              </form>
            </div>
          )
        }
      </div>
    );
  }
}

Reset.contextTypes = {
  router: PropTypes.object
};


export default Reset;

/*
  密码UI：
  <form className="ui form" onSubmit={this.handleSubmit}>
    <div className="field">
      <label>密码</label>
      <input type="password" name="password" placeholder="新密码" onChange={this.handleChange} required />
    </div>
    <div className="field">
      <label>请输入Email</label>
      <input type="password" name="password_agn" placeholder="确认新密码" onChange={this.handleChange} required />
    </div>
    <button className="ui button" type="submit">重置密码</button>
  </form>
*/
