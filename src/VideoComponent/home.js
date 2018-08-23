import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './home.less';
import {getAuthHeader} from "../utils";
import Loading from "../Components/Loading";
import { Link } from 'react-router-dom';

class VideoHome extends Component {


  constructor(props) {
    super(props);
    this.state = {
        video_list: [{"thumbnail": "test.jpg", "title": "Test 1", "last": "Danny", "first": "Chew", "date":
      "Today"}, {"thumbnail": "test.jpg", "title": "Test 1", "last": "Danny", "first": "Chew", "date":
    "Today"} ,{"thumbnail": "test.jpg", "title": "Test 1", "last": "Danny", "first": "Chew", "date":
  "Today"}, {"thumbnail": "test.jpg", "title": "Test 1", "last": "Danny", "first": "Chew", "date":
"Today"}, {"thumbnail": "test.jpg", "title": "Test 1", "last": "Danny", "first": "Chew", "date":
"Today"}],
        loaded: [],
      };

    this.handleThumbnailLoaded = this.handleThumbnailLoaded.bind(this);
  }


  componentDidMount(){
    this.setState({isLoading: true});
    axios.post('/api/get_mentee_info', {mentee_uid: this.props.match.params.uid}, getAuthHeader()).then(res => {
      this.setState({user: res.data.user, isLoading: false});
    }).catch(()=>{
      this.setState({notAuthorized: true});
    });
  }

  //FIXME: Type refers to sections
  handleThumbnailLoaded(index, type) {
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
    return (
      <div className="video-home">

        <div className="card">
          <div className="title">
            <div>走心教学</div>
            <div className="subtitle">让你们看看我们的不一样！</div>
          </div>

          <div className="content">
           {
             this.state.video_list.map((el, index) => (
               <Link to={'/watch/'+el.id} key={el.id}>
               <div className="list-news-container new-big" key={el.id}>
                 <div className={(this.state.loaded[index] ? "" : "list-news-picture on-load")}>
                 <img className="list-news-picture"  src={el.thumbnail} alt={el.title} onLoad={() => {
                   this.handleThumbnailLoaded(index, "top")}}/>
                   </div>
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

      </div>
    );
  }
}

VideoHome.contextTypes = {
    router: PropTypes.object
};

export default VideoHome;
