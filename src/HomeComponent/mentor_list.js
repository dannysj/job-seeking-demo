import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './home.css';
import {fetchMentorList} from "../redux/mentorListAction";
import store from '../redux'
import {connect} from 'react-redux'

class MentorList extends Component {

  componentWillMount(){
    store.dispatch(fetchMentorList());
  }

  render() {

    return (
      <div className="overview-holder">
        {this.props.mentors.slice(0,8).map((el, index) => (
          <Link to={'/mentor/'+el.mid} key={index}>
            <div className="mentor-overview_container" key={el.id}>
              <img className="mentor-overview-picture" src={el.profile_pic} alt={el.last + '' + el.first}/>
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
  return {mentors: state.mentor_list.mentors};
};

export default connect(mapStateToProps)(MentorList);
