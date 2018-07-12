import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Divider, Button } from 'semantic-ui-react';
import axios from 'axios';
import Footer from '../Components/Footer';
import './news.less';
import store from "../redux";
import {fetchNewsList} from "../redux/newsListAction";
import {connect} from 'react-redux'

class News extends React.Component {
  constructor (props) {
    super(props);
    this.batch_num = 0;
    // axios.post('/api/get_news_list',
    //   {batch_size: this.batch_size, batch_num:this.batch_num}).then(res => {
    //   if(res.data.code===0){
    //     this.batch_num++;
    //     this.setState({newsStore: res.data.newsStore, loading: false});
    //   }
    //   else{
    //     // TODO: detect which error it is, if it is depletion error, show "no more"
    //   }
    // });
    this.state = {
      loaded: [],
      loaded_now: []
    }
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  componentWillMount(){
    store.dispatch(fetchNewsList(this.batch_num));
    this.batch_num++;
  }

  handleImageLoaded(index, type) {
    if (type === "top") {
      if (!this.state.loaded[index]) {
          let curState = this.state;
          curState.loaded[index] = true;
          this.setState({ curState });
      }
    } else {
      if (!this.state.loaded[index]) {
          let curState = this.state;
          curState.loaded_now[index] = true;
          this.setState({ curState });
      }
    }

}

  render() {
    if (this.props.loading) {
      return (
        <div className="loading-news-view">
            <Button basic loading>Loading</Button>
        </div>
      );
    }
    else
    return(
      <div className="news-container">
        <Container>
        <div className="container-sideline">
        <div className="header-text">
        <div className="container-block">
          <div className="chinese-top">热 门 干 货</div>
          <div className="subtitle">Top picks</div>
        </div>
        </div>
        <div className="news-detail-content">
        {
          this.props.news_list.map((el,index) => (
            <Link to={'/news/'+el.id} key={el.id}>
            <div className="list-news-container new-big" key={el.id}>
              <img className={"list-news-picture" + (this.state.loaded[index] ? "" : " on-load")} src={el.thumbnail} alt={el.title} onLoad={() => {
                this.handleImageLoaded(index, "top")}}/>
              <div className="list-news-text">
                <div className="list-news-title">{el.title}</div>
                <div className="list-news-author-details">
                  <div className="list-news-subtitle">{el.last + el.first}</div>
                  <div className="list-news-subtitle">{el.date}</div>
                </div>
              </div>

            </div>
            </Link>
          ))
        }
        </div>
        </div>
        <Divider hidden clearing />
        <Divider hidden clearing />
        <Divider hidden clearing />
          <div className="container-sideline">
          <div className="header-text">
          <div className="container-block">
            <div className="chinese-top">最 新 动 态</div>
            <div className="subtitle">Trending Now</div>
          </div>
          </div>
          <div className="news-detail-content">
          {
            this.props.news_list.map((el,index) => (
              <Link to={'/news/'+el.id} key={el.id}>
              <div className="list-news-container" key={el.id}>
                <img className={"list-news-picture" + (this.state.loaded_now[index] ? "" : " on-load")} src={el.thumbnail} alt={el.title} onLoad={() => {
                  this.handleImageLoaded(index, "trend")}}/>
                <div className="list-news-text">
                  <div className="list-news-title">{el.title}</div>
                  <div className="list-news-subtitle">{el.last + el.first}</div>
                  <br />
                  <div className="list-news-subtitle">{el.date}</div>
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

const mapStateToProps = state => {return {...state.newsStore}};

export default connect(mapStateToProps)(News);
