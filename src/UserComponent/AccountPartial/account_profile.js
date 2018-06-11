import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Image} from 'semantic-ui-react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import '../account.css';
import ImgCrop from './ImgCrop/imgcrop.js';

// import { Document, Page } from 'react-pdf';

class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddServiceModal: false,
      showImgCrop: false,
      fileName: this.props.user.resume,
      attr_key: {"hi":""},
    };
    this.tempService = {};

    // This binding is necessary to make `this` work in the callback
    this.initAttrChange = this.initAttrChange.bind(this);
    this.confirmAttrChange = this.confirmAttrChange.bind(this);
    this.cancelAttrChange = this.cancelAttrChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHeader = this.handleHeader.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);

  }

  initAttrChange (key_name) {
    let curState = this.state;
    if (curState.showAddServiceModal) {

    }
    let attr_keys = curState.attr_key;
    let list = curState.attr_list;


    attr_keys[key_name] = "";

    this.setState({attr_key:attr_keys, showAddServiceModal:true});
  }

  confirmAttrChange(e) {
    e.preventDefault();
    // TODO: Process and upload data
    let curState = this.state;
    let attr_keys = curState.attr_key;
    curState.showAddServiceModal = false
    this.setState({showAddServiceModal : false});
    //FIXME: Fixe bunches data update
    for (const [key, value] of Object.entries(attr_keys)) {
      axios.post(process.env.REACT_APP_API_HOST + '/api/update_user',{uid:this.props.user.id,attr:key,val:value}).then(res => {
      if(res.data.code===0){
        this.props.user[key] = value;
        this.props.onUpdate(this.props.user);
        delete curState.attr_keys[key];
        this.setState({curState})
      }
      else{
        alert(res.data.errMsg);
        //TODO: Error Handling
      }
    });
    }
  }

  handleResume(e) {
    var fileType = e.target.files[0]["type"];
    var validTypes = ["application/pdf"];
    if (validTypes.indexOf(fileType) < 0) {
      // invalid file type code goes here.
      NotificationManager.error('简历格式必须为pdf', '错误');
      return;
    }
    // upload first, then
    let data = new FormData();
    // for security reason, can't access local files on client's comp
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post(process.env.REACT_APP_API_HOST + '/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        console.log("Res is 0, successfully upload resume");
        this.setState({fileName: res.data.url});

        handler.props.user.resume = res.data.url;
        handler.props.onUpdate(handler.props.user);
        console.log(handler.props.user)
        console.log("Hmm")
        axios.post(process.env.REACT_APP_API_HOST + '/api/update_user',{uid:this.props.user.id,attr:'resume',val:res.data.url}).then(res => {
          if(res.data.code===0){
            console.log("Res is 0, successfully changed image")
            NotificationManager.success('简历上传成功','完成啦');
          }
          else{
            alert(res.data.errMsg);
            //TODO: Error Handling
          }
        });

      }
      else{
        // TODO: error handling
        alert('PDF Error');
      }
    });
  }

  onDocumentLoad = ({ numPages }) => {
  this.setState({ numPages });
  this.setState({pageNumber: 1});
}

  handleHeader(e){
    // check legit files
    var fileType = e.target.files[0]["type"];
    var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (ValidImageTypes.indexOf(fileType) < 0) {
      // invalid file type code goes here.
      NotificationManager.error('必须是图片文件', '错误');
      return;
    }

    var file = e.target.files[0];
    var fileReader = new FileReader();
    var handler = this;
    fileReader.onloadend = function (e2) {
      handler.setState({showImgCrop: true, imgCropDataUrl: e2.target.result, imgCropName: file.name})
    };
    fileReader.readAsDataURL(file);
  }

  onSuccessCrop = (img) => {
    if (!img) {
      this.setState({showImgCrop: false});
      return;
    }
    let data = new FormData();
    data.append('file', img);
    let handler = this;

    axios.post(process.env.REACT_APP_API_HOST + '/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        console.log("Calling upload")
        handler.props.user.profile_pic = res.data.url;
        this.setState({showImgCrop: false})
        handler.props.onUpdate(handler.props.user);
        axios.post(process.env.REACT_APP_API_HOST + '/api/update_user',{uid:this.props.user.id,attr:'profile_pic',val:res.data.url}).then(res => {
          if(res.data.code===0){
            console.log("Res is 0, successfully changed image")
            NotificationManager.success('头像上传成功','上传成功');
          }
          else{
            alert(res.data.errMsg);
            //TODO: Error Handling
          }
        });
      }
      else{
        // TODO: error handling
        alert('Header Error');
      }
    });
  }

  cancelAttrChange(e) {
    //e.preventDefault();
    let curState = this.state;
    curState.showAddServiceModal = false;
    delete curState.attr_keys[e.target.name];
    this.setState(curState);
  }

  handleInputChange(e, data) {
    let attr_keys = this.state.attr_key;
    attr_keys[e.target.name] = e.traget.value
    this.setState({attr_key:attr_keys});
  }

    render() {
      console.log("testing")
      console.log(this.state.attr_key.hasOwnProperty('last'));
      console.log(this.state.attr_key);
        return(
            <div className="ui large celled list">
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
                      <Image className="center-profile" small bordered src={this.props.user.profile_pic} />
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
                    <div className="info">{this.props.user.last}</div>
                  </div>
                  <div className="inner-content">
                    <div className="header">名</div>
                    <div className="info">{this.props.user.first}</div>
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
                    <div className="ui gray deny button" onClick={this.cancelAttrChange}>
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
                  <div className="header">专业</div>
                  <div className="info">{this.props.user.major ? this.props.user.major : '暂无资料'}</div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('last','姓')}>
                    编辑
                  </div>
                </div>


              </div>
              <div className="item">
                <div className="content">
                  <div className="header">自我介绍</div>
                  <div className="info">{this.props.user.cover ? this.props.user.cover : '暂无资料'}</div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('last','姓')}>
                    编辑
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
                  邮件、微信绑定设置
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">Email</div>
                  <div className="info">{this.props.user.email}</div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('last','姓')}>
                    编辑
                  </div>
                </div>

                <div className="expandable-content">
                </div>
              </div>

              <div className="item">
                <div className="content">
                  <div className="header">微信</div>
                  <div className="info">{this.props.user.wechat ? this.props.user.wechat : '暂无资料'}</div>
                  <div className="edit-toggle"  onClick={()=>this.initAttrChange('last','姓')}>
                    编辑
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
              <div className="item">
                <div className="content">
                  <div className="header">简历</div>
                  <div className="info">{this.state.fileName ? '' : '暂无资料'}</div>
                  <label htmlFor="resume-input" className={this.state.fileName ? 'ui button positive' : 'ui button'}>
                    <i className="ui upload icon"/>
                    {this.state.fileName ? '成功' : '上传简历'}
                  </label>
                  <input type="file" accept="application/pdf" className="input-file" id="resume-input" onChange={this.handleResume}/>
                  {this.state.fileName ? (<embed className="resume-holder" src={this.state.fileName} width="100%"
                                                 type='application/pdf'/>) : (<div></div>)}
                  {/*{this.state.fileName ? (*/}
                    {/*<Document file={this.state.fileName} onLoadSuccess={this.onDocumentLoad}> <Page*/}
                      {/*pageNumber={this.state.pageNumber}/>*/}
                    {/*</Document>) : (<div></div>)}*/}
                </div>
              </div>
              </div>


            </div>


        );
    }
}

AccountProfile.contextTypes = {
    router: PropTypes.object
};

export default AccountProfile;
