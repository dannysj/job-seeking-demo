import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';
import axios from 'axios';
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
      <div>
        <Container text>
          {
            this.state.news_list.map(el => (
              <div className="list-news-container">
                <img className="list-news-picture" src={el.thumbnail}/>
                <div className="list-news-text">
                  <h4>{el.title}</h4>
                  <p dangerouslySetInnerHTML={{__html:el.content}}/>
                </div>
                <Link to={'/news/'+el.id}><Button floated='right' >点击查看细节>></Button></Link>
              </div>
            ))
          }
        </Container>
      </div>
    );
  }
}

News.contextTypes = {
    router: PropTypes.object
};

export default News;
