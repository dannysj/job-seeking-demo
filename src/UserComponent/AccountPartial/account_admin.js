import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Button, Image, Input} from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import '../account.less';
import {NotificationManager} from "react-notifications";
import {getAuthHeader} from "../../utils";

class AccountAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state =
      {
        news: { content: '' , thumbnail: '' },
        applications: [],
        loaded: []
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleThumbnail = this.handleThumbnail.bind(this);
    this.handleSubmitNews = this.handleSubmitNews.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAppDecision = this.handleAppDecision.bind(this);
    this.handleCompanyIcon = this.handleCompanyIcon.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.updateInfo();
  }


  updateInfo() {
    let handler = this;
    axios.post('/api/admin/get_applications', {}, getAuthHeader()).then(res => {
      const list = res.data.applications.map(e => e.id);
      handler.setState({applications: res.data.applications, loaded: list});
    });
  }

  handleChange(value) {
    let curState = this.state;
    curState.news.content = value;
    this.setState(curState);
  }

  handleImageLoaded(index) {
    let loaded = this.state.loaded;
    let newLoaded = loaded.filter(e => e !== index)
    this.setState({ loaded: newLoaded });

  }

  handleThumbnail(e){
    let data = new FormData();
    data.append('file', e.target.files[0]);
    let handler = this;

    axios.post('/api/file/general_upload', data).then(res => {
      let curState = handler.state;
      curState['news']['thumbnail'] = res.data.url;
      handler.setState(curState);
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

    axios.post('/api/file/general_upload_name_perserved', data).then(res => {
      NotificationManager.success('上传成功', '成功');
    });
  }

  handleSubmitNews(){
    let data = this.state.news;
    data.author_id = this.props.user.id;
    axios.post('/api/create_news', data, getAuthHeader()).then(res => {
      NotificationManager.success('干货成功上传', '成功');
      this.context.router.history.push('/news/' + res.data.nid);
    });
  }

  handleAppDecision(uid, mid, ispassed){
    let decision = ispassed ? 1 : 0 ;

    let handler = this;

    axios.post('/api/admin/decide_mentor_app',{mid:mid, decision:decision},getAuthHeader()).then(res => {
        NotificationManager.success('操作成功','成功');
        // handler.state.applications.forEach(function(app, index){
        //   if(app.id == mid){
        //     handler.state.applications.slice(index, 1);
        //   }
        // });
        // handler.setState({applications: handler.state.applications});
        handler.updateInfo();
    });
  }

  renderRow = (name, text) =>
    (<div className="item">
        <div className="logo-item">{name}</div>
        <div className="card-info">{text}</div>
      </div>
    );


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
          <div className="content">
          <div className="inner-content service-card-container">
          {this.state.applications.length===0 && '暂无申请'}
          {this.state.applications.map(el => (
            <div className="app-mentor-container" key={el.id}>
            <div className="mentee-top">
            <div className={((this.state.loaded.indexOf(el.id) == -1) ? "" : "app-mentor-picture on-load circular")}>
            <img className="app-mentor-picture" src={el.profile_pic} alt={el.last + ' ' + el.first} onLoad={() => {this.handleImageLoaded(el.id)}}/>
            </div>
            <div className="info">
              <div className="name superlarge">{el.last+' '}{el.first}</div>
            </div>


            </div>
              <div className="app-mentor-text">
                <div className="mentor-text-inner">
                {this.renderRow('在读院校', el.college_name)}
                {this.renderRow('offer公司', el.offer_company)}
                {this.renderRow('专业', "")}
                {this.renderRow('offer职位', el.offer_title)}
                </div>
              </div>
              <div className="button-group">
              <Link to={'/mentor/'+el.mid}><Button floated='right' >查看细节>></Button></Link>
              <Button floated='right' positive onClick={() => this.handleAppDecision(el.id, el.mid, true)}>批准申请</Button>
              <Button floated='right' negative onClick={() => this.handleAppDecision(el.id, el.mid, false)}>拒绝申请</Button>
              </div>
            </div>
          ))}
          </div>
          </div>
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
