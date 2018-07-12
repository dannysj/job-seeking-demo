import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Dropdown, Image, TextArea} from 'semantic-ui-react';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import '../account.less';
import ImgCrop from './ImgCrop/imgcrop.js';
import store from "../../redux";
import {updateUser} from "../../redux/userAction";
import {fetchMajorList} from "../../redux/majorListAction";
import {connect} from 'react-redux'
import validator from 'validator';


class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImgCrop: false,
      attr_key: {},
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

      store.dispatch(updateUser(attr, val, this.props.user.access_token));

      delete curState.attr_key[attr];
      this.setState({curState});
  }
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
        store.dispatch(updateUser("resume", res.data.url, this.props.user.access_token));

        axios.post('/api/update_user',
        {
          attr: 'resume',
          val: res.data.url
        },
        {
          headers: {access_token: this.props.user.access_token}
        }).then(res => {
          if (res.data.code === 0)
            NotificationManager.success('简历上传成功', '完成啦');
          else
            NotificationManager.error('资料更新失败', '错误');
        });
      }
      else {
        NotificationManager.error('简历上传失败', '错误');
      }
    });
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
        store.dispatch(updateUser("profile_pic", res.data.url, this.props.user.access_token));
        axios.post('/api/update_user',
        {
          attr: 'profile_pic',
          val: res.data.url
        },
        {
          headers:{access_token: this.props.user.access_token}
        }
        ).then(res => {
          if (res.data.code === 0) {
            NotificationManager.success('头像上传成功', '上传成功');
          }
          else {
            NotificationManager.error('资料更新失败', '错误');
          }
        });
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
  }

  handleInputChange = (e, data) => {
    let attr_keys = this.state.attr_key;
    attr_keys[e.target.name] = e.target.value
    this.setState({attr_key:attr_keys});
  }

    render() {
      const user = this.props.user;
        return(
            <div className="ui large celled list form">
              <NotificationContainer />
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
              <div className="item center">
                <div className="img-crop-item">
                {this.state.showImgCrop ? ( <ImgCrop dataUrl={this.state.imgCropDataUrl} fileName={this.state.imgCropName} onSuccess={this.onSuccessCrop}/> )
                  :
                  ( <div className="imgContainer">
                    <div className="image-text-centered">点击更换头像</div>
                    <label className="header-input-label" htmlFor="header-input">
                      <Image className="center-profile" small bordered src={user.profile_pic} />
                    </label>
                    <input type="file" accept="image/*" className="input-file" id="header-input" onChange={this.handleHeader} />
                    </div>
                  )}
                  </div>
              </div>
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

                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('major')) ? "is-expanded" : "")}>
                  <div className="form-text">
                      <Dropdown name='major' placeholder='专业' search selection multiple fluid closeOnChange
                                options={this.props.major_list}
                                onChange={(e, data) => this.setState({attr_key: {major: data.value}})}
                                value={this.state.attr_key.major ? this.state.attr_key.major : []}/>
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
              <div className={"item first "+ ((this.state.attr_key.hasOwnProperty('email')) ? "is-expanded" : "")}>
                <div className="content">
                  <div className="inner-content">
                  <div className="header">Email</div>
                  <div className="info">{user.email}</div>
                  </div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('email')}>
                    编辑
                  </div>
                </div>

                <div className={"expandable-content " + ((this.state.attr_key.hasOwnProperty('email')) ? "is-expanded" : "")}>
                  <div className="form-text">
                    <input type="text" name="email" value={this.state.attr_key.email} onChange={this.handleInputChange}/>
                    <div className="padding-text"></div>
                  </div>
                  <div className="actions">
                    <div className="ui gray deny button" onClick={() => {
                      this.cancelAttrChange("email");
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
                <div className="inner-content">
                  <div className="header">简历</div>
                  <div className="info">{user.resume ? '' : '暂无资料'}</div>
                  <label htmlFor="resume-input" className={user.resume ? 'ui button positive' : 'ui button'}>
                    <i className="ui upload icon"/>
                    {user.resume ? '成功' : '上传简历'}
                  </label>
                  <input type="file" accept="application/pdf" className="input-file" id="resume-input" onChange={this.handleResume}/>
                  {user.resume ? (<embed className="resume-holder" src={user.resume} width="100%"
                                                 type='application/pdf'/>) : (<div></div>)}
                </div>
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
