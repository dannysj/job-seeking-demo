import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Image, Segment, Container, Icon, Button } from 'semantic-ui-react';
import './news.css';
import ProfileFollow from '../Components/ProfileFollow';

class NewsDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      news:{
        thumbnail: '/img/loading.gif'
      },
      loading:true
    };
    axios.post('/api/get_news_detail',
      {nid:this.props.match.params.nid}).then(res => {

      if(res.data.code==0){
        console.log(res.data);
        let curState = this.state;
        curState.news = res.data.news;
        curState.loading = false;
        this.setState(curState);
      }
      else{
      }
    });
  }

  // {this.props.match.params.mid}

  render() {
    const backimgstyle = {
      backgroundImage: 'url('+this.state.news.thumbnail+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      };
    if (this.state.loading) {
      return (
        <div className="loading-news-view">
            <Button basic loading>Loading</Button>
        </div>
      );
    }
    else
    return (
      <div>
        <div className="header-cover main-cover" style={backimgstyle}>
        </div>
        <div className="news-content">
          <div className="news-sidebar icon-sidebar">
            <a href="test" ><div className="circle-icon">
                <Icon className="wechat-logo" circular={true} name="wechat" />
              </div>
            </a>
            <a href="test" ><div className="circle-icon">
                <Icon className="weibo-logo" circular={true} name="weibo" />
              </div>
            </a>
            <a href="test" ><div className="circle-icon">
                <Icon className="facebook-logo" circular={true} name="facebook f" />
              </div>
            </a>
          </div>
          <div className="news-detail-container">
            <div className="author-format">{this.state.news.author_last+' '+this.state.news.author_first + "  ·  " + this.state.news.publish_time}</div>
            <div className="article-title">{this.state.news.title}</div>
            <div className="vertical-line-half"></div>
            <div className="news-detail-content" dangerouslySetInnerHTML={{__html:this.state.news.content}}></div>
            <ProfileFollow user={{"last": this.state.news.author_last, "first": this.state.news.author_first, "profile_pic": this.state.news.profile_pic}}/>
          </div>
          <div className="news-sidebar">
          </div>

        </div>
        <div className="like-button">
          <Icon name="like outline" />
        </div>
      </div>
    );
  }
}

NewsDetail.contextTypes = {
    router: PropTypes.object
};

export default NewsDetail;
