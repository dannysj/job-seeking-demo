import React from "react";
import axios from "axios";
import store from "../../../redux";
import {changeUserPassword, updateAccessToken} from "../../../redux/userAction";
import {NotificationManager} from "react-notifications";

export default class PasswordEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }

  getInitState = () => ({
    editing: false,
    old_password: null,
    new_password: null,
    confirm_password: null,
  });

  confirmPasswordChange = (e) => {
    e.preventDefault();
    axios.post("/api/verify_user", {
      password: this.state.old_password,
      email: this.props.user.email
    }).then(res => {
      store.dispatch(updateAccessToken(res.data.user.access_token));

      if (this.state.new_password === "") {
        NotificationManager.error("新密码不能为空", "错误");
        return
      }

      if (this.state.new_password !== this.state.confirm_password) {
        NotificationManager.error("确认密码和新密码不一致", "错误");
        return;
      }

      store.dispatch(changeUserPassword(this.state.new_password)).then(() => {
        this.setState(this.getInitState());
      });
    });
  };

  handleInputChange = (e) => this.setState({[e.target.name]: e.target.value});

  renderBox = (chinese, name, placeholder) => (
    <div className="row">
      <div className="ten wide column">
        <label>{chinese}</label>
        <input type="password"
               name={name}
               placeholder={placeholder}
               onChange={this.handleInputChange}
               value={this.state[name]}
               required/>
      </div>
    </div>);


  render() {
    const editing = this.state.editing;
    return (
      <div className={"item " + (editing ? "is-expanded" : "")}>

        <div className="content">
          <div className="inner-content">
            <div className="header">密码设置</div>
            <div className="info">密码不可见</div>
          </div>
          <div className="edit-toggle" onClick={() => this.setState({editing: true})}>
            更改
          </div>
        </div>


        <div className={"expandable-content " + (editing ? "is-expanded" : "")}>
          <div className="form-text">
            <div className="ui segment">
              <div className="ui grid">
                {this.renderBox('旧密码', 'old_password', 'Old Password')}
                {this.renderBox('新密码', 'new_password', 'New Password')}
                {this.renderBox('确认密码', 'confirm_password', 'Confirm Password')}
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="ui gray deny button" onClick={() => this.setState(this.getInitState())}>
              取消
            </div>
            <div className="ui blue right labeled icon button" onClick={this.confirmPasswordChange}>
              确认
              <i className="checkmark icon"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}