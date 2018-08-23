import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Input, Button, TextArea, Progress} from 'semantic-ui-react';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import '../account.less';
import {connect} from 'react-redux';
import store from "../../redux";
import validator from 'validator';
import {getAuthHeader} from "../../utils";

class AccountUploadVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          doneChoosing: false,
          percent: 50,
        };

        this.handleHeader = this.handleHeader.bind(this);
    }

    componentWillMount(){
      axios.post('/api/get_mentor_detail_by_uid', {}, getAuthHeader()).then(res => {
        if (res.data.code === 0) {
          const mentor = res.data.mentor;
          this.setState({
            mentor_info: mentor,
            statusChecked: true,
            hasNotApplied: false
          });
        } else if (res.data.code === 55) {
          this.setState({statusChecked: true, hasNotApplied: true});
        }
      });
    }

    handleHeader = (e) => {
      // check legit files
      const fileType = e.target.files[0]["type"];
      const ValidImageTypes = ["video/*"];
      if (ValidImageTypes.indexOf(fileType) < 0) {
        // invalid file type code goes here.
        NotificationManager.error('必须是视频文件', '错误');
        return;
      }

      const file = e.target.files[0];
      const fileReader = new FileReader();
      const handler = this;
      fileReader.onloadend = function (e2) {
        // do smth
        handler.setState({})
      };
      fileReader.readAsDataURL(file);
    };

    handleSubmit = (e) => {
      e.preventDefault();

    };

    render() {
    return this.state.doneChoosing ?  (
      <div>
      <div className="category">
        <div className="header">
          <div className="title">
            上传影片
          </div>
        </div>
      </div>

        <div className="category last">
          <div className="item first">
          <div className="content dir">
          <div className="inner-content write-section">
          <div className="video-thumbnail">
          <div>
          <div className={"list-news-picture on-load"}>
          <img className="list-news-picture"  src={"Test"} alt={"Test"} />
            </div>
            </div>

            <div className="details">
              <div className="status">上传完毕！</div>
              <Progress percent={this.state.percent} indicating />
            </div>
            </div>
            <br />
            <br />
            <div className="status">亲，请填写资料噢</div>
          <Input placeholder='标题' onChange={this.handleTitleChange}/>
          <br />
          <div className=" ui form">
          <TextArea style={{minHeight: 100}} name="cover" value={""} placeholder="Description" />
          </div>
          <div classNmae="button-group">



          <Button onClick={this.cancelSubmit}>取消</Button>
          <Button color="blue" onClick={this.handleSubmitNews}>上传</Button>
          </div>
        </div>
        </div>
        </div>
        </div>
      </div>


) : (
        <div className="account-inner-spacing video-upload">
        <label htmlFor="header-input" className="content-input">
        <div className="content-upload">
          <Icon name="cloud upload" size="massive"/>
          <div className="subtitle">点击这里上传视频</div>
          <input type="file" accept="video/*" className="input-file" id="header-input" onChange={this.handleHeader} />
        </div>
        </label>
      </div>
    );
  }
}

AccountUploadVideo.contextTypes = {
    router: PropTypes.object
};

export default AccountUploadVideo;
