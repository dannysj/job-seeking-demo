import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header, Input, Segment } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import '../account.css';

class CreateArticle extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        news: { content: '' , thumbnail: '' }
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleThumbnail = this.handleThumbnail.bind(this);
    this.handleSubmitNews = this.handleSubmitNews.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  handleChange(value) {
    let curState = this.state;
    curState.news.content = value;
    this.setState(curState);
  }

  handleThumbnail(e){
    let data = new FormData();
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post(process.env.REACT_APP_API_HOST + '/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        let curState = handler.state;
        curState['news']['thumbnail'] = res.data.url;
        handler.setState(curState);
      }
      else{
        NotificationManager.error('无法上传图片','错误');
      }
    });
  }

  handleTitleChange(e) {
    let curState = this.state;
    curState.news.title = e.target.value;
    this.setState(curState);
  }

  handleSubmitNews(){
    let data = this.state.news;
    data.author_id = this.props.user.id;
    axios.post(process.env.REACT_APP_API_HOST + '/api/create_news',data).then(res => {
      if(res.data.code===0){
        NotificationManager.success('上传成功，点击查看','成功',5000,()=>{
          this.context.router.history.push('/news/'+res.data.nid);
        });
      }
      else{
        NotificationManager.error('无法上传干货','错误');
      }
    });
  }


  render() {
    return(
      <div>
        <NotificationContainer />
        <Segment>
          <h4>编写干货:</h4>
          标题: {' '}<Input placeholder='标题' onChange={this.handleTitleChange}/>
          <br />
          <label htmlFor="thumbnail-input" className="ui button">
            <i className="ui upload icon"/>
            缩略图上传
          </label>
          <input type="file" className="input-file" id="thumbnail-input" onChange={this.handleThumbnail}/>
          {this.state.news.thumbnail && (<Image src={this.state.news.thumbnail} size='small' />)}
          <br />
          <ReactQuill value={this.state.news.content} onChange={this.handleChange} />
          <Button onClick={this.handleSubmitNews}>提交</Button>
        </Segment>
      </div>
    );
  }
}

CreateArticle.contextTypes = {
    router: PropTypes.object
};

export default CreateArticle;
