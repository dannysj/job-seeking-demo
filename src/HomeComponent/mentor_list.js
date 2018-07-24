import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './home.less';
import {fetchMentorList} from "../redux/mentorListAction";
import store from '../redux'
import {connect} from 'react-redux'

class MentorList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loaded: [],
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  componentWillMount(){
    store.dispatch(fetchMentorList());
  }

  handleImageLoaded(index) {
    if (!this.state.loaded[index]) {
        let curState = this.state;
        curState.loaded[index] = true;
        this.setState({ curState });
    }
}

  render() {

    return (
      <div className="overview-holder">
        {this.props.mentors.slice(0,8).map((el, index) => (
          <Link to={'/mentor/'+el.mid} key={index}>
            <div className="mentor-overview_container" key={el.id}>
            <div className={(this.state.loaded[index] ? "" : "mentor-overview-picture on-load")}>
              <img className="mentor-overview-picture"  src={el.profile_pic} alt={el.last + '' + el.first} onLoad={() => {
                this.handleImageLoaded(index)}}/>
                </div>
              <div className="mentor-overview-placeholder">
                <h4>{el.last+' '}{el.first}</h4>
                <p className="mentor-overview-text">{el.offer_company+' '+el.offer_title}</p>
                <p className="mentor-overview-text">{el.college_name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {mentors: state.mentorListStore.mentors};
};

export default connect(mapStateToProps)(MentorList);
