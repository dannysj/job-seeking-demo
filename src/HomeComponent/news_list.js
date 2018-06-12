import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header, Container, Segment, Button } from 'semantic-ui-react';
import axios from 'axios';
import './home.css';

class NewsList extends Component {
  constructor (props) {
    super(props);
    this.state={
      news_list:[]
    };
    this.batch_size = 10;
    this.batch_num = 0;
    axios.post(process.env.REACT_APP_API_HOST + '/api/get_news_list',
      {batch_size: this.batch_size, batch_num:this.batch_num}).then(res => {
      if(res.data.code==0){
        this.batch_num++;

        let curState = this.state;
        curState.news_list = res.data.news_list.slice(0,6);
        this.setState(curState);
      }
      else{
        // TODO: detect which error it is, if it is depletion error, show "no more"
      }
    });
  }

  render() {
    return (
      <div className="overview-holder">
        {this.state.news_list.map(el => (
          <Link to={'/news/'+el.id}>
            <div className="news-overview_container" key={el.id}>
              <img className="news-overview-picture" src={el.thumbnail}></img>
              <div className="news-overview-second">
                <div className="news-overview-text">
                  <h4>{el.title}</h4>
                </div>
                  <div className="news-overview-stamp">
                  <div>{el.last + el.first}</div>
                  <div>{el.date}</div>
                  </div>
                </div>

            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default NewsList;
