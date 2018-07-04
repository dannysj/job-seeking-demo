import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Image, Input, Segment } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import '../account.less';

class AccountAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        news: { content: '' , thumbnail: '' },
        applications: []
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleThumbnail = this.handleThumbnail.bind(this);
    this.handleSubmitNews = this.handleSubmitNews.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAppDecision = this.handleAppDecision.bind(this);
    this.handleCompanyIcon = this.handleCompanyIcon.bind(this);

    this.updateInfo();
  }

  updateInfo() {
    let handler = this;
    axios.post('/api/admin/get_applications').then(res => {
      if(res.data.code === 0){
        handler.setState({applications: res.data.applications});
      }
      else{
        // TODO: error handling
        alert('Database Error');
        console.log(res.data);
      }
    });
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

    axios.post('/api/file/general_upload', data).then(res => {
      if(res.data.code === 0){
        let curState = handler.state;
        curState['news']['thumbnail'] = res.data.url;
        handler.setState(curState);
      }
      else{
        // TODO: error handling
        alert('Thumbnail Error');
        console.log(res.data);
      }
    });
    //
    // var reader = new FileReader();
    // var curState = this.state;
    // var handler = this;
    // reader.readAsDataURL(e.target.files[0]);
    // reader.onload = function () {
    //
    //   curState['news']['thumbnail'] = reader.result;
    //   handler.setState(curState);
    // };
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  handleTitleChange(e) {
    let curState = this.state;
    curState.news.title = e.target.value;
    this.setState(curState);
  }

  handleCompanyIcon(e) {
    let data = new FormData();
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post('/api/file/general_upload_name_perserved', data).then(res => {
      if(res.data.code === 0){
        alert('Success!');
      }
      else{
        // TODO: error handling
        alert('Thumbnail Error');
        console.log(res.data);
      }
    });
  }

  handleSubmitNews(){
    let data = this.state.news;
    data.author_id = this.props.user.id;
    axios.post('/api/create_news',data).then(res => {
      if(res.data.code===0){
        alert('success'); // TODO: change this
        this.context.router.history.push('/news/'+res.data.nid);
      }
      else{
        alert(); // TODO: proper err
      }
    });
  }

  handleAppDecision(uid, mid, ispassed){
    let decision = ispassed ? 1 : 0 ;

    let handler = this;

    axios.post('/api/admin/decide_mentor_app',{uid:uid,mid:mid,decision:decision}).then(res => {
      if(res.data.code===0){
        alert('success'); // TODO: change this
        // handler.state.applications.forEach(function(app, index){
        //   if(app.id == mid){
        //     handler.state.applications.slice(index, 1);
        //   }
        // });
        // handler.setState({applications: handler.state.applications});
        handler.updateInfo();
      }
      else{
        alert(res.data.errMsg); // TODO: proper err
      }
    });
  }


  render() {
    if(!this.props.user.isadmin){
      return (<h1>您没有权限访问本页，别给老子瞎搞</h1>);
    }
    return(
      <div className="account-inner-spacing">
        <div className="category">
          <div className="header">
            <div className="title">
            编写干货
            </div>
          </div>
          </div>
        <div className="category">
          <div className="item first">
          <div className="content dir">
          <div className="inner-content write-section">
          <div>标题: {' '}</div><Input placeholder='标题' onChange={this.handleTitleChange}/>
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
          </div>
          </div>
          </div>
        </div>
        <div className="category">
          <div className="header">
            <div className="title">
            审核Mentor申请
            </div>
          </div>
          <div className="item first">
          {this.state.applications.length===0 && '暂无申请'}
          {this.state.applications.map(el => (
            <div className="app-mentor-container" key={el.id}>
              <img className="app-mentor-picture" src={el.profile_pic} alt="mentor"/>
              <div className="app-mentor-text">
                <h4>{el.last+' '}{el.first}</h4>
                <p>Offer公司: {el.offer_company}</p>
                <p>Offer职位: {el.offer_title}</p>
                <p>院校: {el.college_name}</p>
              </div>
              <Link to={'/mentor/'+el.mid}><Button floated='right' >查看细节>></Button></Link>
              <Button floated='right' positive onClick={() => this.handleAppDecision(el.uid, el.mid, true)}>批准申请</Button>
              <Button floated='right' negative onClick={() => this.handleAppDecision(el.uid, el.mid, false)}>拒绝申请</Button>
            </div>
          ))}
          </div>
        </div>
        <div className="category last">
          <div className="header">
            <div className="title">
            上传公司图片
            </div>
            <div className="subtitle">
              保持文件名与公司名一致，全部小写，后缀名jpg，去掉空格以及单引号
            </div>
          </div>
          <div className="item">
            <label htmlFor="company-icon-input" className="ui button">
              <i className="ui upload icon"/>
              公司logo上传
            </label>
            <input type="file" className="input-file" id="company-icon-input" onChange={this.handleCompanyIcon}/>
            </div>
        </div>
      </div>
    );
  }
}

AccountAdmin.contextTypes = {
    router: PropTypes.object
};

export default AccountAdmin;
