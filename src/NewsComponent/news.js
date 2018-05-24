import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Container, Divider } from 'semantic-ui-react';
import axios from 'axios';
import Footer from '../Components/Footer';
import './news.css';

class News extends React.Component {
  constructor (props) {
    super(props);
    this.state={
      news_list:[]
    };
    this.batch_size = 10;
    this.batch_num = 0;
    axios.post('/api/get_news_list',
      {batch_size: this.batch_size, batch_num:this.batch_num}).then(res => {
      if(res.data.code===0){
        this.batch_num++;
        console.log(res.data);
        let curState = this.state;
        curState.news_list = res.data.news_list;
        this.setState(curState);
      }
      else{
        // TODO: detect which error it is, if it is depletion error, show "no more"
      }
    });
  }

  render() {
    return(
      <div className="new-container">
        <Container>
        <div className="container-sideline">
        <div className="header-text">
        <div className="container-block">
          <div className="chinese-top">热 门 大 哥</div>
          <div className="subtitle">Top picks</div>
        </div>
        </div>
        <Divider hidden clearing />
        <div className="news-detail-content">
        {
          this.state.news_list.map(el => (
            <Link to={'/news/'+el.id}>
            <div className="list-news-container new-big" key={el.id}>
              <img className="list-news-picture" src={el.thumbnail}/>
              <div className="list-news-text">
                <div className="list-news-title">{el.title}</div>
                <div className="cut-text" dangerouslySetInnerHTML={{__html:el.content}}/>

                <br />
                <div className="list-news-subtitle">{el.first + el.last + " · " + el.publish_time}</div>
              </div>
            </div>
            </Link>
          ))
        }
        </div>
        </div>
        <Divider hidden clearing />
          <div className="container-sideline">
          <div className="header-text">
          <div className="container-block">
            <div className="chinese-top">最 新 动 态</div>
            <div className="subtitle">Newest wow</div>
          </div>
          </div>
          <Divider hidden clearing />
          <div className="news-detail-content">
          {
            this.state.news_list.map(el => (
              <Link to={'/news/'+el.id}>
              <div className="list-news-container" key={el.id}>
                <img className="list-news-picture" src={el.thumbnail}/>
                <div className="list-news-text">
                  <div className="list-news-title">{el.title}</div>
                  <div className="cut-text" dangerouslySetInnerHTML={{__html:el.content}}/>
                  <Divider hidden clearing />
                  <div className="list-news-subtitle">{el.first + el.last + " · " + el.publish_time}</div>

                </div>
              </div>
              </Link>
            ))
          }
          </div>
          </div>
        </Container>
        <Divider hidden clearing />
        <Footer />
      </div>
    );
  }
}

News.contextTypes = {
    router: PropTypes.object
};

export default News;
