import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Image, Dropdown} from 'semantic-ui-react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'axios';
import '../account.css';
import ImgCrop from './ImgCrop/imgcrop.js';


class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddServiceModal: false,
      showImgCrop: false,
      fileName: this.props.user.resume,
      attr_key: '',
      attr_val: '',
      attr_display_name: '',
      major_list : [],
      editMode: false,
    };
    this.tempService = {};

    axios.post(process.env.REACT_APP_API_HOST + '/api/get_major_list').then(res => {
      if (res.data.code === 0) {
        this.setState({major_list: res.data.list});
      }  else {
        NotificationManager.error('无法获取专业列表', '错误');
      }
    });

    // This binding is necessary to make `this` work in the callback
    this.initAttrChange = this.initAttrChange.bind(this);
    this.confirmAttrChange = this.confirmAttrChange.bind(this);
    this.cancelAttrChange = this.cancelAttrChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHeader = this.handleHeader.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);

  }

  initAttrChange (key_name, display_name) {
    this.setState({attr_key:key_name, attr_val:'', attr_display_name:display_name, showAddServiceModal:true});
  }

  confirmAttrChange(e) {
    e.preventDefault();
    // TODO: Process and upload data
    this.setState({showAddServiceModal : false, editMode: false});
    const key = this.state.attr_key;
    const value = this.state.attr_val;
    axios.post(process.env.REACT_APP_API_HOST + '/api/update_user',{uid:this.props.user.id,attr:this.state.attr_key,val:this.state.attr_val}).then(res => {
      if(res.data.code===0){
        this.props.user[key] = value;
        this.props.onUpdate(this.props.user);
      }
      else{
        alert(res.data.errMsg);
        NotificationManager.error('资料更新失败', '错误');
      }
    });
  }

  handleResume(e) {
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
    let handler = this;

    axios.post(process.env.REACT_APP_API_HOST + '/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        this.setState({fileName: res.data.url});

        handler.props.user.resume = res.data.url;
        handler.props.onUpdate(handler.props.user);
        axios.post(process.env.REACT_APP_API_HOST + '/api/update_user',{uid:this.props.user.id,attr:'resume',val:res.data.url}).then(res => {
          if(res.data.code===0){
            console.log("Res is 0, successfully changed image")
            NotificationManager.success('简历上传成功','完成啦');
          }
          else{
            NotificationManager.error('资料更新失败', '错误');
          }
        });

      }
      else{
        NotificationManager.error('简历上传失败', '错误');
      }
    });
  }

  onDocumentLoad = ({ numPages }) => {
  this.setState({ numPages });
  this.setState({pageNumber: 1});
}

  handleHeader(e){
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
            NotificationManager.error('资料更新失败', '错误');
          }
        });
      }
      else{
        NotificationManager.error('头像上传失败', '错误');
      }
    });
  }

  cancelAttrChange(e) {
    e.preventDefault();
    let curState = this.state;
    curState.showAddServiceModal = false;
    this.setState(curState);
  }

  handleInputChange(e, data) {
    this.setState({attr_val:e.target.value});
  }

    render() {
      let modalClassName='ui modal';
      if(this.state.showAddServiceModal){
        modalClassName += ' add-service-container';
      }


        return(
            <div className="ui large celled list">
              <NotificationContainer />
              <div className={modalClassName}>
                <i className="close icon"/>
                <div className="header">

                  {this.state.attr_display_name}
                </div>
                <div className="add-service-form-container">
                  <form className="ui form">
                    <div className="field">
                      <label>{this.state.attr_display_name}：</label>
                      <input type="text" name="name" value={this.state.attr_val} onChange={this.handleInputChange} />
                    </div>
                  </form>
                </div>
                <div className="actions">
                  <div className="ui black deny button" onClick={this.cancelAttrChange}>
                    取消
                  </div>
                  <div className="ui positive right labeled icon button" onClick={this.confirmAttrChange}>
                    确认
                    <i className="checkmark icon"/>
                  </div>
                </div>
              </div>
              <div className="item">
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
              <div className="item">
                <div className="content">
                  <div className="header">姓{' '}<Button floated='right' onClick={()=>this.initAttrChange('last','姓')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.last}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">名<Button floated='right' onClick={()=>this.initAttrChange('first','名')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.first}</div>
                </div>
              </div>

              <div className="item">
                <div className="content">
                  <div className="header">Email<Button floated='right' onClick={()=>this.initAttrChange('email','Email')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.email}</div>
                </div>
              </div>

              <div className="item">
                <div className="content">
                  <div className="header">微信<Button floated='right' onClick={()=>this.initAttrChange('wechat','微信')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.wechat ? this.props.user.wechat : '暂无资料'}</div>
                </div>
              </div>

              <div className="item">
                <div className="content">
                  <div className="header">
                    专业
                    {this.state.editMode?
                      <Button floated='right' onClick={this.confirmAttrChange}>
                        <i className="checkmark icon positive ui"/>
                      </Button>
                      :
                      <Button floated='right' onClick={()=>this.setState({attr_key: 'major', editMode: true})}>
                        <Icon name='write' size='small' />
                      </Button>
                    }
                  </div>
                  <div className="info">
                    {this.state.attr_key === 'major' && this.state.editMode?
                      <Dropdown name='major' placeholder='专业' search selection allowAdditions
                                options={this.state.major_list}
                                onChange={(e, data) => this.setState({attr_val: this.state.major_list[data.value - 1].text})} // TODO: Use major id instead of major name
                                selectedValue={this.state.attr_val}/>

                    :
                      this.props.user.major ? this.props.user.major : '暂无资料'
                    }


                  </div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">自我介绍<Button floated='right' onClick={()=>this.initAttrChange('cover','自我介绍')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.cover ? this.props.user.cover : '暂无资料'}</div>
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
                                                 type='application/pdf'/>) : (<div/>)}
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
