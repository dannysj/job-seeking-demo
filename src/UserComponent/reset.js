import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './user.less';

class Reset extends Component {

  constructor(props) {
    super(props);
    this.state = {user: {}, success: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({success: true})
    //TODO:
    /*
        axios.post('/api/verify_user',this.state.user).then(res => {
          if(res.data.code===0){
            store.dispatch(setUser(res.data.user));
            if(this.context.router.history.location.pathname === "/login"){
              this.context.router.history.push("/");
              return;
            }
            this.context.router.history.goBack();
          }
          else{
            NotificationManager.error('登入失败', '错误');
          }
        });*/
  }

  handleChange(e) {
    let curUser = this.state.user;
    curUser[e.target.name] = e.target.value;
    this.setState({user: curUser});
  }

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
