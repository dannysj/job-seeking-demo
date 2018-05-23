import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Image, Segment, Container } from 'semantic-ui-react';
import './news.css';

class NewsDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      news:{
        thumbnail: '/img/loading.gif'
      }
    };
    axios.post('/api/get_news_detail',
      {nid:this.props.match.params.nid}).then(res => {

      if(res.data.code==0){
        console.log(res.data);
        let curState = this.state;
        curState.news = res.data.news;
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
    return (
      <div>
        <div className="header-cover" style={backimgstyle}>
        </div>
        <div className="news-content">
          <div className="news-sidebar">
          </div>
          <div className="news-detail-container">
            <div className="author-format">{this.state.news.author_last+' '+this.state.news.author_first + " · " + this.state.news.publish_time}</div>
            <h1>{this.state.news.title}</h1>
            <div className="vertical-line-half"></div>
            <br /><br />
            <div className="news-detail-content" dangerouslySetInnerHTML={{__html:this.state.news.content}}></div>
          </div>
          <div className="news-sidebar">
          </div>
        </div>
      </div>
    );
  }
}

NewsDetail.contextTypes = {
    router: PropTypes.object
};

export default NewsDetail;
