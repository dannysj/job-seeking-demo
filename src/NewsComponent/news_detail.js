import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Image, Segment } from 'semantic-ui-react';
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
    return (
      <div className="news-detail-container">
        <Image src={this.state.news.thumbnail} size='medium' rounded centered/>
        <h3>{this.state.news.title}</h3>
        <p>作者: {this.state.news.author_last+' '+this.state.news.author_first}</p>
        <p>发布时间: {this.state.news.publish_time}</p>
        <br /><br />
        <div className="news-detail-content" dangerouslySetInnerHTML={{__html:this.state.news.content}}></div>
      </div>
    );
  }
}

NewsDetail.contextTypes = {
    router: PropTypes.object
};

export default NewsDetail;
