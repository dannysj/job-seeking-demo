import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './home.less';
import store from "../redux";
import {fetchNewsList} from "../redux/newsListAction";
import {connect} from "react-redux";

class NewsList extends Component {
  constructor (props) {
    super(props);
    this.batch_num = 0;
  }

  componentWillMount(){
    store.dispatch(fetchNewsList(this.batch_num)).then(()=>{
      this.batch_num++;
    });
  }

  render() {
    return (
      <div className="overview-holder">
        {this.props.news_list.slice(0,6).map((el, index) => (
          <Link to={'/news/'+el.id} key={index}>
            <div className="news-overview_container" key={el.id}>
              <img className="news-overview-picture" src={el.thumbnail} alt={el.title}/>
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


const mapStateToProps = state => {
  return {...state.newsStore}
};

export default connect(mapStateToProps)(NewsList);
