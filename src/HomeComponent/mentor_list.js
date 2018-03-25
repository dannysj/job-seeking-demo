import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header, Container, Segment } from 'semantic-ui-react';
import axios from 'axios';
import './home.css';

class MentorList extends Component {

  constructor (props) {
    super(props);

    this.state={mentors:[]};
    axios.post('http://localhost:3005/api/get_mentor_list',this.props.filter).then(res => {
      if(res.data.code==0){
        console.log(res.data.list);
        this.setState({mentors:res.data.list.slice(0,6)});
      }
      else{
        //TODO: Error Handling
      }
    });
    // this.context.router.route.location.pathname
  }

  render() {

    return (
      <div className="overview-holder">
        {this.state.mentors.map(el => (
          <Link to={'/mentor/'+el.mid}>
            <div className="mentor-overview_container" key={el.id}>
              <img className="mentor-overview-picture" src={el.profile_pic}></img>
              <div className="mentor-overview-text">
                <h4>{el.last+' '}{el.first}</h4>
                <p>Offer: {el.offer_company+' '+el.offer_title}</p>
                <p>院校: {el.college_name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default MentorList;
