import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Icon, Button, Divider } from 'semantic-ui-react';
import './news.less';
import Footer from '../Components/Footer';
import ProfileFollow from '../Components/ProfileFollow';
import * as QuillDeltaToHtmlConverter from  'quill-delta-to-html'
import Loading from "../Components/Loading";

class NewsDetail extends Component {

  constructor (props) {
    super(props);
    this.state={
      news:{
        thumbnail: '/img/loading.gif'
      },
      loading:true,
      image_loaded:false,
    };

    this.likeButtonPressed = this.likeButtonPressed.bind(this);
    this.followButtonPressed = this.followButtonPressed.bind(this);
      this.handleImageLoaded = this.handleImageLoaded.bind(this);

    axios.post('/api/get_news_detail',
      {nid:this.props.match.params.nid}).then(res => {

      if(res.data.code===0){
        let curState = this.state;
        curState.news = res.data.news;

        if (curState.news.delta !== null) // compatibility, will be removed and use delta
          curState.news.content = new QuillDeltaToHtmlConverter(curState.news.delta["ops"]).convert();

        curState.loading = false;
        this.setState(curState);
      }
      else{
      }
    }).catch(err => console.log(err)  )  ;


  }

  handleImageLoaded() {
      if (!this.state.image_loaded) {
          let curState = this.state;
          curState.image_loaded = true;
          this.setState({ curState });
      }

}

  likeButtonPressed(e) {

  }

  followButtonPressed(e) {
    console.log("Test");
    // User id, props.loggedInUser.uid
    // The other one. this.state.news.author_id
    // call the function
    axios.post('/api/follow_user',
     {follower_uid: this.props.loggedInUser.id , followee_uid: this.state.news.author_id}).then(res=>{
        console.log("follow")
    }).catch(err=> console.log(err))
  }


  render() {
    const backimgstyle = {
      backgroundImage: 'url('+this.state.news.thumbnail+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      };
    if (this.state.loading) {
      return (<Loading/>);
    }
    //TODO: Onload event for this
    else
    return (
      <div>
        <div className={"header-cover main-cover "} style={backimgstyle} >
        </div>
        <div className="news-content">
          <div className="news-sidebar icon-sidebar">
            <a href="test" ><div className="circle-icon">
                <Icon className="wechat-logo" circular={true}  size="large" name="wechat" />
              </div>
            </a>
            <a href="test" ><div className="circle-icon">
                <Icon className="weibo-logo" circular={true} size="large" name="weibo" />
              </div>
            </a>
            <a href="test" ><div className="circle-icon">
                <Icon className="facebook-logo" circular={true} size="large" name="facebook f" />
              </div>
            </a>
          </div>
          <div className="news-detail-container">
            <div className="author-format">{this.state.news.author_last+' '+this.state.news.author_first + "  ·  " + this.state.news.publish_time}</div>
            <div className="article-title">{this.state.news.title}</div>
            <div className="vertical-line-half"></div>
            <div className="news-detail-content" dangerouslySetInnerHTML={{__html:this.state.news.content}}></div>
              <Divider hidden clearing />
            <ProfileFollow user={{
                  "last": this.state.news.author_last,
                  "first": this.state.news.author_first,
                  "profile_pic": this.state.news.profile_pic,
                  "cover": this.state.news.author_cover,
                }}
                loggedInUser={this.props.loggedInUser}
                author_id = {this.state.news.author_id}
                />
          </div>
          <div className="news-sidebar">
          </div>

        </div>
        <div className="like-button" onClick={this.likeButtonPressed}>
          <Icon name="like outline" />
        </div>
        <Divider hidden clearing />
        <Footer />
      </div>
    );
  }
}

NewsDetail.contextTypes = {
    router: PropTypes.object
};

export default NewsDetail;
