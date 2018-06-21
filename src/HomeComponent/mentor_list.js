import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './home.css';

class MentorList extends Component {

  constructor (props) {
    super(props);

    this.state={mentors:[]
    };
    axios.post('/api/get_mentor_list',this.props.filter).then(res => {
      if(res.data.code===0){
        this.setState({mentors:res.data.list.slice(0,6)});
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  render() {

    return (
      <div className="overview-holder">
        {this.state.mentors.map((el, index) => (
          <Link to={'/mentor/'+el.mid} key={index}>
            <div className="mentor-overview_container" key={el.id}>
              <img className="mentor-overview-picture" src={el.profile_pic} alt={el.last + '' + el.last}/>
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

export default MentorList;
