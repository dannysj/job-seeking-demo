import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';
import axios from 'axios';
import '../account.css';
import ImgCrop from './ImgCrop/imgcrop.js';

class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddServiceModal: false,
      showImgCrop: false

    };
    this.tempService = {};

    // This binding is necessary to make `this` work in the callback
    this.initAttrChange = this.initAttrChange.bind(this);
    this.confirmAttrChange = this.confirmAttrChange.bind(this);
    this.cancelAttrChange = this.cancelAttrChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHeader = this.handleHeader.bind(this);
  }

  initAttrChange (key_name, display_name) {
    this.setState({attr_key:key_name, attr_val:'', attr_display_name:display_name, showAddServiceModal:true});
  }

  confirmAttrChange(e) {
    e.preventDefault();
    // TODO: Process and upload data
    this.setState({showAddServiceModal : false});
    console.log(this.state.attr_val);
    const key = this.state.attr_key;
    const value = this.state.attr_val;
    axios.post('/api/update_user',{uid:this.props.user.id,attr:this.state.attr_key,val:this.state.attr_val}).then(res => {
      if(res.data.code===0){
        this.props.user[key] = value;
        this.props.onUpdate(this.props.user);
      }
      else{
        alert(res.data.errMsg);
        //TODO: Error Handling
      }
    });
  }

  handleHeader(e){
    // check legit files
    var fileType = e.target.files[0]["type"];
    var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (ValidImageTypes.indexOf(fileType) < 0) {
         // invalid file type code goes here.
         alert("Not a valid image. Please choose again.")
         return
    }
    // upload first, then
    let data = new FormData();
    // for security reason, can't access local files on client's comp
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post('/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        console.log("Calling IMGCROP")
        console.log("Res is 0, successfully uploaded image")
        this.setState({showImgCrop: true, imgCropDataUrl: res.data.url})

      }
      else{
        // TODO: error handling
        alert('Header Error');
      }
    });
  }

  onSuccessCrop = (img) => {
    if (img === undefined) {
      this.setState({showImgCrop: false})
      return
    }
    let data = new FormData();
    data.append('file', img);
    let handler = this;

    axios.post('/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        console.log(res.data);
        console.log("Calling upload")
        handler.props.user.profile_pic = res.data.url;
        this.setState({showImgCrop: false})
        handler.props.onUpdate(handler.props.user);
        axios.post('/api/update_user',{uid:this.props.user.id,attr:'profile_pic',val:res.data.url}).then(res => {
          if(res.data.code===0){
              console.log("Res is 0, successfully changed image")

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
                {this.state.showImgCrop ? ( <ImgCrop dataUrl={this.state.imgCropDataUrl} onSuccess={this.onSuccessCrop}/> )
                  :
                  ( <div>
                    <label className="header-input-label" htmlFor="header-input">
                      <img className="ui medium image profile_pic" src={this.props.user.profile_pic}/>
                    </label>
                    <input type="file" className="input-file" id="header-input" onChange={this.handleHeader} />
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
                  <div className="header">专业<Button floated='right' onClick={()=>this.initAttrChange('major','专业')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.major ? this.props.user.major : '暂无资料'}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">出生日期<Button floated='right' onClick={()=>this.initAttrChange('dob','出生日期')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.dob ? this.props.user.dob.substring(0,10) : '暂无资料'}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">注册日期</div>
                  <div className="info">{this.props.user.register_date?this.props.user.register_date.substring(0,10):'暂无资料'}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">自我介绍<Button floated='right' onClick={()=>this.initAttrChange('cover','自我介绍')}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.cover ? this.props.user.cover : '暂无资料'}</div>
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
