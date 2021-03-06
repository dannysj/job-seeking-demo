import React from 'react';
import PropTypes from 'prop-types';
import {Button, Image, Input} from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import '../account.less';
import {getAuthHeader} from "../../utils";

class CreateArticle extends React.Component {
  state = {
    news: {thumbnail: null, delta: []}
  };

  componentDidMount() {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  }

  handleThumbnail = (e) => {
    let data = new FormData();
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post('/api/file/general_upload', data).then(res => {
      let curState = handler.state;
      curState['news']['thumbnail'] = res.data.url;
      handler.setState(curState);
    });
  };

  handleChange = () => {
    let curState = this.state;
    curState.news.delta = this.quillRef.getContents();
    this.setState(curState);
  };

  handleTitleChange = (e) =>{
    let curState = this.state;
    curState.news.title = e.target.value;
    this.setState(curState);
  };

  handleSubmitNews = () => {
    let data = this.state.news;
    data.author_id = this.props.user.id;
    axios.post('/api/create_news', data, getAuthHeader()).then(res => {
      NotificationManager.success('上传成功，点击查看', '成功', 5000, () => {
        this.context.router.history.push('/news/' + res.data.nid);
      });
    });
  };


  render() {
    return(
      <div>
        <div className="category">
          <div className="header">
            <div className="title">
              编写干货
            </div>
          </div>
        </div>
        <div className="category last">
          <div className="item first">
          <div className="content dir">
          <div className="inner-content write-section">
          <div>
          标题: {' '}</div><Input placeholder='标题' onChange={this.handleTitleChange}/>
          <br />
          <label htmlFor="thumbnail-input" className="ui button">
            <i className="ui upload icon"/>
            缩略图上传
          </label>
          <br />
          <input type="file" className="input-file" id="thumbnail-input" onChange={this.handleThumbnail}/>
          {this.state.news.thumbnail && (<Image src={this.state.news.thumbnail} size='small' />)}
          <br />

          <ReactQuill ref={(el) => { this.reactQuillRef = el }} onChange={this.handleChange} />

          <Button onClick={this.handleSubmitNews}>提交</Button>
        </div>
        </div>
        </div>
        </div>
      </div>
    );
  }
}

CreateArticle.contextTypes = {
    router: PropTypes.object
};

export default CreateArticle;
