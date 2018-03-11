import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header, Input } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import '../account.css';

class AccountAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      { news:
        { content: '' , thumbnail: '' }
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleThumbnail = this.handleThumbnail.bind(this);
    this.handleSubmitNews = this.handleSubmitNews.bind(this);
  }

  handleChange(value) {
    var curState = this.state;
    curState.news.content = value;
    this.setState(curState);
  }

  handleThumbnail(e){
    var reader = new FileReader();
    var curState = this.state;
    var handler = this;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {

      curState['news']['thumbnail'] = reader.result;
      handler.setState(curState);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  handleSubmitNews(){
    let data = this.state.news;
    data.author_id = this.props.user.id;
    axios.post('http://localhost:3005/api/admin/create_news',data).then(res => {
      if(res.data.code==0){
        console.log(res.data.nid);
        alert('success'); // TODO: change this
      }
      else{
        alert(); // TODO: proper err
      }
    });
  }


  render() {
    if(!this.props.user.isadmin){
      return (<h1>您没有权限访问本页，别给老子瞎搞</h1>);
    }
    return(
      <div>
        <h4>编写干货:</h4>
        标题: {' '}<Input placeholder='标题'/>
        <br />
        <label for="thumbnail-input" className="ui button">
          <i className="ui upload icon"></i>
          缩略图上传
        </label>
        <input type="file" className="input-file" id="thumbnail-input" onChange={this.handleThumbnail}/>
        {this.state.news.thumbnail && (<Image src={this.state.news.thumbnail} size='small' />)}
        <br />
        <ReactQuill value={this.state.news.content} onChange={this.handleChange} />
        <Button onClick={this.handleSubmitNews}>提交</Button>
      </div>
    );
  }
}

AccountAdmin.contextTypes = {
    router: PropTypes.object
};

export default AccountAdmin;
