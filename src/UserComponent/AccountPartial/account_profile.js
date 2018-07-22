import React from 'react';
import {NotificationManager} from 'react-notifications';
import {Dropdown, Image, TextArea} from 'semantic-ui-react';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import '../account.less';
import './account_profile.less'
import ImgCrop from './ImgCrop/imgcrop.js';
import store from "../../redux";
import {changeUserPassword, updateUser, updateAccessToken, changeEmail} from "../../redux/userAction";
import {fetchMajorList} from "../../redux/majorListAction";
import {connect} from 'react-redux'
import validator from 'validator';


class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImgCrop: false,
      attr_key: {},
      verification_sent:  false,
      verification_sent_count_down: 30
    };
  }

  componentWillMount() {
    store.dispatch(fetchMajorList());
  }

  initAttrChange = (key_name) => {
    let curState = this.state;
    let attr_keys = curState.attr_key;

    attr_keys[key_name] = this.props.user[key_name];

    this.setState({attr_key:attr_keys});
  };


    initAttrChangePassword = (key_name) => {
        let curState = this.state;
        let attr_keys = curState.attr_key;

        attr_keys[key_name] = "";

        this.setState({attr_key:attr_keys});
    };

  confirmAttrChange = (e) => {
    e.preventDefault();
    // TODO: Process and upload data
    let curState = this.state;
    let attr_keys = curState.attr_key;

    //FIXME: Fixe bunches data update
    for (const [attr, val] of Object.entries(attr_keys)) {
      if (attr === "email" && !validator.isEmail(val)) {
        NotificationManager.error('Email格式不正确', '错误');
        return;
      }

      if ((attr === "first" || attr === "last") && val.trim() === "") {
        NotificationManager.error('姓名不能为空', '错误');
        return;
      }

      store.dispatch(updateUser(attr, val));

      delete curState.attr_key[attr];
      this.setState({curState});
  }
 };

  confirmPasswordChange = (e) =>{
      e.preventDefault();
      let curState = this.state;
      axios.post("/api/verify_user", {password: this.state.attr_key["old_password"], email: this.props.user.email})
          .then(res =>{
              if (res.data.code === 1){
                  NotificationManager.error("原密码不正确，请重新输入", "错误");
                  return
              }

              store.dispatch(updateAccessToken(res.data.user.access_token));

              if (this.state.attr_key["new_password"] === ""){
                  NotificationManager.error("新密码不能为空", "错误");
                  return
              }

              if ( this.state.attr_key["new_password"] !== this.state.attr_key["confirm_password"] ){
                  NotificationManager.error("确认密码和新密码不一致", "错误");
                  return;
              }

              //this.confirmAttrChange(e)
              store.dispatch(changeUserPassword(this.state.attr_key["new_password"])).then(()=>{
                  curState.attr_key["new_password"] = ""
                  curState.attr_key["old_password"] = ""
                  curState.attr_key["confirm_password"] = ""
                  delete curState.attr_key["new_password"];
                  delete curState.attr_key["old_password"];
                  delete curState.attr_key["confirm_password"];
                  this.setState({curState});
              });

          }
          )
          .catch(err => console.log(err));
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
      if (res.data.code === 0) {
        store.dispatch(updateUser("resume", res.data.url));
      } else {
        NotificationManager.error('简历上传失败', '错误');
      }
    });
  };

  confirmNewEmailChange = (e) =>{
      e.preventDefault();
      let curState = this.state;
      axios.post("/api/verify_code", {code: this.state.attr_key.verification_code},{headers: {access_token:store.getState().user.access_token}})
          .then(res=>{
                  if (res.data.code === 1){
                      NotificationManager.error("验证码不正确", "错误");
                      return
                  }

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
      if (res.data.code === 0) {
        this.setState({showImgCrop: false});
        store.dispatch(updateUser("profile_pic", res.data.url));
      }
      else {
        NotificationManager.error('头像上传失败', '错误');
      }
    });
  };

  cancelAttrChange = (key_name) => {
    let curState = this.state;
    delete curState.attr_key[key_name];
    this.setState(curState);
  };

  sendVerificationCode = ()=>{
    if (!validator.isEmail(this.state.attr_key.new_email)) {
      NotificationManager.error('Email格式不正确', '错误');
      return;
    }

    axios.post("/api/verify_new_email", {new_email: this.state.attr_key.new_email},{headers: {access_token:store.getState().user.access_token}})
      .then(res=>{
          if (res.data.code === 1){
            NotificationManager.error("验证码不正确", "错误");
            return
          }

        NotificationManager.success("发送验证码成功", "成功");
        }
      );

    // Send verification
    this.setState(
        {
            verification_sent_count_down: 30,
            verification_sent: true
        }
    );

    let interval = setInterval(()=>{

        let new_count_down = this.state.verification_sent_count_down - 1;
        if (new_count_down === -1){
            clearInterval(interval);
            this.setState({
                verification_sent: false,
            })
        }
        else {
            this.setState({
                verification_sent: true,
                verification_sent_count_down: new_count_down
            })
        }
    } ,1000)

  };

  verficationCodeButton = ()=>{

      if (this.state.verification_sent){

          let sentence = this.state.verification_sent_count_down + "后可以再次发送验证码";

          return (
              <div className="ui disabled button">
                  {sentence}
              </div>
          )
      }
      return(
        <div className="eight wide column">
            <button className="ui primary button" onClick={this.sendVerificationCode} >
              发送验证
            </button>
        </div>
      );
  };

  handleInputChange = (e, data) => {
    let attr_keys = this.state.attr_key;
    attr_keys[e.target.name] = e.target.value;
    this.setState({attr_key:attr_keys});
  };

    render() {
      const user = this.props.user;
        return(
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
                {this.state.showImgCrop ? ( <ImgCrop dataUrl={this.state.imgCropDataUrl} fileName={this.state.imgCropName} onSuccess={this.onSuccessCrop}/> )
                  :
                  ( <div className="imgContainer">
                    <div className="image-text-centered">点击更换头像</div>
                    <label className="header-input-label" htmlFor="header-input">
                      <Image className="center-profile" small="true" bordered src={user.profile_pic} />
                    </label>
                    <input type="file" accept="image/*" className="input-file" id="header-input" onChange={this.handleHeader} />
                    </div>
                  )}
                  </div>
              </div>


              {/*first and last*/}
              <div className={"item " + ((this.state.attr_key.hasOwnProperty('last')) ? "is-expanded" : "")}>
                <div className="content">
                  <div className="inner-content">
                    <div className="header">姓{' '}</div>
                    <div className="info">{user.last}</div>
                  </div>
                  <div className="inner-content">
                    <div className="header">名</div>
                    <div className="info">{user.first}</div>
                  </div>
                  <div className="edit-toggle"  onClick={()=> {
                    this.initAttrChange('last');
                    this.initAttrChange('first');
                  }}>
                    编辑
                  </div>
                </div>

                {/*first and last edit*/}
                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('last')) ? "is-expanded" : "")}>
                  <div className="form-text">
                    <input type="text" name="last" value={this.state.attr_key.last} onChange={this.handleInputChange}/>
                    <input type="text" name="first" value={this.state.attr_key.first} onChange={this.handleInputChange}/>
                    <div className="padding-text"></div>
                  </div>
                  <div className="actions">
                    <div className="ui gray deny button" onClick={() => {
                      this.cancelAttrChange("last");
                      this.cancelAttrChange("first");
                    }}>
                      取消
                    </div>
                    <div className="ui blue right labeled icon button" onClick={this.confirmAttrChange}>
                      确认
                      <i className="checkmark icon"/>
                    </div>
                  </div>
                </div>
              </div>

              {/*major     */}
              <div className={"item " + ((this.state.attr_key.hasOwnProperty('major')) ? "is-expanded" : "")} >
                <div className="content">
                  <div className="inner-content">
                  <div className="header">专业</div>
                  <div className="info">{user.major ? user.major.join(", ") : '暂无资料'}</div>
                  </div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('major')}>
                    编辑
                  </div>

                </div>

                {/*major edit*/}
                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('major')) ? "is-expanded" : "")}>
                  <div className="form-text">
                    {(this.state.attr_key.hasOwnProperty('major')) &&
                    <Dropdown name='major' placeholder='专业' search selection multiple fluid closeOnChange
                              options={this.props.major_list}
                              onChange={(e, data) => this.setState({attr_key: {major: data.value}})}
                              value={this.state.attr_key.major ? this.state.attr_key.major : []}/>}
                    <div className="padding-text"></div>

                  </div>
                  <div className="actions">
                    <div className="ui gray deny button" onClick={() => {
                      this.cancelAttrChange("major");
                    }}>
                      取消
                    </div>
                    <div className="ui blue right labeled icon button" onClick={this.confirmAttrChange}>
                      确认
                      <i className="checkmark icon"/>
                    </div>
                  </div>
                </div>
              </div>


              {/*bio    */}
              <div className={"item " + ((this.state.attr_key.hasOwnProperty('cover')) ? "is-expanded" : "")}>
                <div className="content">
                  <div className="inner-content">
                  <div className="header">自我介绍</div>
                  <div className="info">{user.cover ? user.cover : '暂无资料'}</div>
                  </div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('cover')}>
                    编辑
                  </div>
                </div>

               {/*bio edit */}
                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('cover')) ? "is-expanded" : "")}>
                  <div className="form-text">
                    <TextArea rows="8" name="cover" value={this.state.attr_key.cover} onChange={this.handleInputChange}/>
                    <div className="padding-text"></div>
                  </div>
                  <div className="actions">
                    <div className="ui gray deny button" onClick={() => {
                      this.cancelAttrChange("cover");
                    }}>
                      取消
                    </div>
                    <div className="ui blue right labeled icon button" onClick={this.confirmAttrChange}>
                      确认
                      <i className="checkmark icon"/>
                    </div>
                  </div>
                </div>
              </div>


              {/*password*/}
              <div className={"item " + ((this.state.attr_key.hasOwnProperty('old_password')) ? "is-expanded" : "")}>
                  <div className="content">
                      <div className="inner-content">
                          <div className="header">密码设置</div>
                          <div className="info">{'密码不可见'}</div>
                      </div>
                      <div className="edit-toggle"
                           onClick={()=>{
                                this.initAttrChangePassword('old_password');
                                this.initAttrChangePassword('new_password');
                                this.initAttrChangePassword('confirm_password');}}>
                          更改
                      </div>
                  </div>


                  {/*password edit */}
                  <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('old_password')) ? "is-expanded" : "")}>

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
                                     required />
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
              <div className={"item first "+ ((this.state.attr_key.hasOwnProperty('new_email')) ? "is-expanded" : "")}>
                <div className="content">
                  <div className="inner-content">
                  <div className="header">Email</div>
                  <div className="info">{user.email}</div>
                </div>
                <div className="edit-toggle"  onClick={()=>{
                                                            this.initAttrChange('new_email');
                                                            this.initAttrChange('verification_code')}}>
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


              {/*Wechat*/}
              <div className="item">
                <div className="content">
                  <div className="inner-content">
                  <div className="header">微信号</div>
                  <div className="info">{user.wechat ? user.wechat : '暂无资料'}</div>
                  </div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('wechat')}>
                    编辑
                  </div>

                </div>
                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('wechat')) ? "is-expanded" : "")}>
                  <div className="form-text">
                    <input type="text" name="wechat" value={this.state.attr_key.wechat} onChange={this.handleInputChange}/>
                    <div className="padding-text"></div>
                  </div>
                  <div className="actions">
                    <div className="ui gray deny button" onClick={() => {
                      this.cancelAttrChange("wechat");
                    }}>
                      取消
                    </div>
                    <div className="ui blue right labeled icon button" onClick={this.confirmAttrChange}>
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
                      <br />
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

const mapStateToProps = state => {
  const {user, major_list} = state;
  return {user, major_list};
};


export default connect(mapStateToProps)(AccountProfile);
