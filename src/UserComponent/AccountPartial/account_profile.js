import React from 'react';
import {NotificationManager} from 'react-notifications';
import {Dropdown, Image} from 'semantic-ui-react';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import '../account.less';
import './account_profile.less'
import ImgCrop from './ImgCrop/imgcrop.js';
import store from "../../redux";
import {changeUserPassword, updateAccessToken, updateUser} from "../../redux/userAction";
import {fetchMajorList} from "../../redux/majorListAction";
import {connect} from 'react-redux'
import validator from 'validator';
import {getAuthHeader} from "../../utils";
import ProfileRow from "./Component/ProfileRow";

@connect(state => ({
  major_list: state.major_list,
  user: state.user
}))
class AccountProfile extends React.Component {
  state = {
    showImgCrop: false,
    attr_key: {},
    verification_sent_count_down: 0
  };


  componentDidMount() {
    store.dispatch(fetchMajorList());
  }

  initAttrChange = (key_name) => {
    let curState = this.state;
    let attr_keys = curState.attr_key;

    attr_keys[key_name] = this.props.user[key_name];

    this.setState({attr_key: attr_keys});
  };


  initAttrChangePassword = (key_name) => {
    let curState = this.state;
    let attr_keys = curState.attr_key;

    attr_keys[key_name] = "";

    this.setState({attr_key: attr_keys});
  };


  confirmPasswordChange = (e) => {
    e.preventDefault();
    let curState = this.state;
    axios.post("/api/verify_user", {
      password: this.state.attr_key["old_password"],
      email: this.props.user.email
    }).then(res => {
      store.dispatch(updateAccessToken(res.data.user.access_token));

      if (this.state.attr_key["new_password"] === "") {
        NotificationManager.error("新密码不能为空", "错误");
        return
      }

      if (this.state.attr_key["new_password"] !== this.state.attr_key["confirm_password"]) {
        NotificationManager.error("确认密码和新密码不一致", "错误");
        return;
      }

      store.dispatch(changeUserPassword(this.state.attr_key["new_password"])).then(() => {
        delete curState.attr_key["new_password"];
        delete curState.attr_key["old_password"];
        delete curState.attr_key["confirm_password"];
        this.setState({curState});
      });
    });
  };

  handleResume = (e) => {
    const fileType = e.target.files[0]["type"];
    const validTypes = ["application/pdf"];
    if (validTypes.indexOf(fileType) < 0) {
      // invalid file type code goes here.
      NotificationManager.error('简历格式必须为pdf', '错误');
      return;
    }
    // upload first, then
    let data = new FormData();
    // for security reason, can't access local files on client's comp
    data.append('file', e.target.files[0]);

    axios.post('/api/file/general_upload', data).then(res => {
      store.dispatch(updateUser("resume", res.data.url));
    });
  };

  confirmNewEmailChange = (e) => {
    e.preventDefault();
    let curState = this.state;
    axios.post("/api/verify_code", {code: this.state.attr_key.verification_code}, getAuthHeader())
      .then(res => {
          store.dispatch(updateUser('email', this.state.attr_key["new_email"]));
          delete curState.attr_key["new_email"];
          delete curState.attr_key["verification_code"];
        }
      )
  };

  handleHeader = (e) => {
    // check legit files
    const fileType = e.target.files[0]["type"];
    const ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (ValidImageTypes.indexOf(fileType) < 0) {
      // invalid file type code goes here.
      NotificationManager.error('必须是图片文件', '错误');
      return;
    }

    const file = e.target.files[0];
    const fileReader = new FileReader();
    const handler = this;
    fileReader.onloadend = function (e2) {
      handler.setState({showImgCrop: true, imgCropDataUrl: e2.target.result, imgCropName: file.name})
    };
    fileReader.readAsDataURL(file);
  };

  onSuccessCrop = (img) => {
    if (!img) {
      this.setState({showImgCrop: false});
      return;
    }
    let data = new FormData();
    data.append('file', img);

    axios.post('/api/file/general_upload', data).then(res => {
      this.setState({showImgCrop: false});
      store.dispatch(updateUser("profile_pic", res.data.url));
    });
  };

  cancelAttrChange = (key_name) => {
    let curState = this.state;
    delete curState.attr_key[key_name];
    this.setState(curState);
  };

  sendVerificationCode = () => {
    const {new_email} = this.state.attr_key;

    if (!validator.isEmail(new_email)) {
      NotificationManager.error('Email格式不正确', '错误');
      return;
    }

    axios.post("/api/verify_new_email", {new_email}, getAuthHeader()).then(res => {
        // Send verification
        this.setState({verification_sent_count_down: 30});

        const interval = setInterval(() => {
          const new_count_down = this.state.verification_sent_count_down - 1;
          if (new_count_down === 0) {
            clearInterval(interval);
          } else {
            this.setState({verification_sent_count_down: new_count_down})
          }
        }, 1000)
      }
    );
  };

  verficationCodeButton = () => {

    if (this.state.verification_sent_count_down > 0) {
      let sentence = this.state.verification_sent_count_down + "秒后可以再次发送验证码";

      return (
        <div className="ui disabled button">
          {sentence}
        </div>
      )
    }
    return (
      <div className="eight wide column">
        <button className="ui primary button" onClick={this.sendVerificationCode}>
          发送验证
        </button>
      </div>
    );
  };

  handleInputChange = (e, data) => {
    let attr_keys = this.state.attr_key;
    attr_keys[e.target.name] = e.target.value;
    this.setState({attr_key: attr_keys});
  };

  render() {
    const user = this.props.user;
    return (
      <div className="ui large celled list form">

        <div className="category">
          <div className="header">
            <div className="title">
              基础资料
            </div>
            <div className="subtitle">
              基础设定资料、账号安全
            </div>
          </div>
        </div>
        <div className="category">
          <div className="subheader">
            <div className="title">
              账户设置
            </div>
            <div className="subtitle">
              名字、密码、专业、自我介绍以及头像设置
            </div>
          </div>


          {/*Profile Picture     */}
          <div className="item center">
            <div className="img-crop-item">
              {this.state.showImgCrop ? (<ImgCrop dataUrl={this.state.imgCropDataUrl} fileName={this.state.imgCropName}
                                                  onSuccess={this.onSuccessCrop}/>)
                :
                (<div className="imgContainer">
                    <div className="image-text-centered">点击更换头像</div>
                    <label className="header-input-label" htmlFor="header-input">
                      <Image className="center-profile" small="true" bordered src={user.profile_pic}/>
                    </label>
                    <input type="file" accept="image/*" className="input-file" id="header-input"
                           onChange={this.handleHeader}/>
                  </div>
                )}
            </div>
          </div>


          <ProfileRow keys={['last', 'first']} names={['姓', '名']} user={user}/>

          <ProfileRow keys={['major']} names={['专业']} user={user}>
            <Dropdown name='major' placeholder='专业' search selection multiple fluid closeOnChange
                      options={this.props.major_list}/>
          </ProfileRow>

          <ProfileRow keys={['cover']} names={['自我介绍']} user={user} multiline={true}/>


          {/*password*/}
          <div className={"item " + ((this.state.attr_key.hasOwnProperty('old_password')) ? "is-expanded" : "")}>
            <div className="content">
              <div className="inner-content">
                <div className="header">密码设置</div>
                <div className="info">{'密码不可见'}</div>
              </div>
              <div className="edit-toggle"
                   onClick={() => {
                     this.initAttrChangePassword('old_password');
                     this.initAttrChangePassword('new_password');
                     this.initAttrChangePassword('confirm_password');
                   }}>
                更改
              </div>
            </div>


            {/*password edit */}
            <div
              className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('old_password')) ? "is-expanded" : "")}>

              {/*Add three box */}
              <div className="form-text">
                <div className="ui segment">
                  <div className="ui grid">
                    <div className="row">
                      <div className="ten wide column">
                        <label>旧密码</label>
                        <input type="password"
                               name="old_password"
                               placeholder="Old Password"
                               onChange={this.handleInputChange}
                               value={this.state.attr_key.old_password}
                               required/>
                      </div>
                    </div>

                    <div className="row">
                      <div className="ten wide column">
                        <label>新密码</label>
                        <input type="password"
                               name="new_password"
                               placeholder="New Password"
                               onChange={this.handleInputChange}
                               value={this.state.attr_key.new_password}
                               required/>
                      </div>
                    </div>

                    <div className="row">
                      <div className="ten wide column">
                        <label>确认密码</label>
                        <input type="password" name="confirm_password"
                               placeholder="Confirm Password"
                               onChange={this.handleInputChange}
                               value={this.state.attr_key.confirm_password}
                               required/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*no need to change                 */}
              <div className="actions">
                <div className="ui gray deny button" onClick={() => {
                  this.cancelAttrChange("new_password");
                  this.cancelAttrChange("old_password");
                  this.cancelAttrChange("confirm_password");
                }}>
                  取消
                </div>
                <div className="ui blue right labeled icon button" onClick={this.confirmPasswordChange}>
                  确认
                  <i className="checkmark icon"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="category">
          <div className="subheader">
            <div className="title">
              联络
            </div>
            <div className="subtitle">
              邮箱、微信号绑定设置
            </div>
          </div>


          {/*Email*/}
          <div className={"item first " + ((this.state.attr_key.hasOwnProperty('new_email')) ? "is-expanded" : "")}>
            <div className="content">
              <div className="inner-content">
                <div className="header">Email</div>
                <div className="info">{user.email}</div>
              </div>
              <div className="edit-toggle" onClick={() => {
                this.initAttrChange('new_email');
                this.initAttrChange('verification_code')
              }}>
                编辑
              </div>
            </div>

            <div className={"expandable-content " +
            ((this.state.attr_key.hasOwnProperty('new_email')) ? "is-expanded" : "")}>

              <div className="ui segment" style={{paddingBottom: "10px"}}>
                <div className="ui stackable two column grid">

                  <label style={{paddingTop: "14px"}}>新Email</label>
                  <div className="row" style={{paddingTop: "0px"}}>
                    <div className="eight wide column">
                      <input type="text" name="new_email"
                             placeholder="新Email"
                             value={this.state.attr_key.new_email}
                             onChange={this.handleInputChange}/>
                    </div>
                    <div className="eight wide column">
                      {this.verficationCodeButton()}
                    </div>
                  </div>
                  <div className="row" style={{paddingBottom: "0px"}}>
                    <div className="eight wide column">
                      <label>输入验证码</label>
                    </div>
                  </div>
                  <div className="row" style={{paddingTop: "0px"}}>
                    <div className="eight wide column">
                      <input type="text" name="verification_code"
                             placeholder="新邮箱里收到的验证码"
                             value={this.state.attr_key.verification_code}
                             onChange={this.handleInputChange}
                      />
                    </div>
                  </div>

                </div>
              </div>
              <div className="actions">
                <div className="ui gray deny button" onClick={() => {
                  this.cancelAttrChange("new_email");
                  this.cancelAttrChange("verification_code");
                }}>
                  取消
                </div>
                <div className="ui blue right labeled icon button" onClick={this.confirmNewEmailChange}>
                  确认
                  <i className="checkmark icon"/>
                </div>
              </div>
            </div>
          </div>


          <ProfileRow keys={['wechat']} names={['微信号']} user={user}/>

        </div>
        <div className="category">
          <div className="subheader">
            <div className="title">
              简历设置
            </div>
            <div className="subtitle">
              这里展示你的简历噢
            </div>
          </div>
          <div className="item first">
            <div className="content">
              {user.resume ? (
                <div className="inner-content">
                  <embed className="resume-holder" src={user.resume} type='application/pdf'/>
                  <br/>
                  <label htmlFor="resume-input" className='ui button negative'
                         onClick={() => {
                           store.dispatch(updateUser("resume", null))
                         }}>
                    <i className="ui trash icon"/> 删除简历
                  </label>
                </div>
              ) : (
                <div className="inner-content">
                  <div className="info">暂无资料</div>
                  <label htmlFor="resume-input" className='ui button positive'>
                    <i className="ui upload icon"/>上传简历
                  </label>
                  <input type="file" accept="application/pdf" className="input-file" id="resume-input"
                         onChange={this.handleResume}/>
                </div>
              )}

            </div>
          </div>
        </div>


      </div>


    );
  }
}


export default AccountProfile;
