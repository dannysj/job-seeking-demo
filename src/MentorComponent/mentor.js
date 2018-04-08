import React, {Component} from 'react';
import {Button, Dropdown} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import './mentor.css';
import axios from "axios/index";

class Mentor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentors: [],
      majors: [],
      colleges: []
    };
    axios.post('/api/get_mentor_list').then(res => {
      if (res.data.code === 0) {
        const mentors = res.data.list;
        let majors = [];
        let colleges = [];
        mentors.forEach((e) => {
          if(majors.indexOf({value: e.major, text: e.major})< 0 & e.major != ""){
            majors.push({value: e.major, text: e.major});
          }
          majors.push({value: e.major, text: e.major});
          if (colleges.indexOf({value: e.college_name, text: e.college_name}) < 0) {
            colleges.push({value: e.college_name, text: e.college_name});
          }
        });

        this.setState({
          mentors: mentors,
          majors: majors,
          colleges: colleges
        });
      }
      else {
        //TODO: Error Handling
      }
    });
  }

  render() {
    return (
      <div className="ui container">
        <div>
          {this.state.mentors.map(el => (
            <div className="mentor-container" key={el.id}>
              <img className="mentor-picture" src={el.profile_pic}/>
              <div className="mentor-text">
                <h4>{el.last + ' '}{el.first}</h4>
                <p>Offer公司: {el.offer_company}</p>
                <p>Offer职位: {el.offer_title}</p>
                <p>院校: {el.college_name}</p>
                <p>领域: {el.major}</p>
                <p>最低价格: {el.lowest_price}</p>
              </div>
              <Link to={'/mentor/' + el.mid}><Button floated='right'>点击查看细节>></Button></Link>
            </div>
          ))}
        </div>

        <div className="ui right internal rail Filter-container">
          <div className="filter-container">
            <h3>筛选导师：</h3>
            <label>选择领域</label>
            <Dropdown placeholder='领域' fluid search selection options={this.state.majors}/>
            <br/>
            <label>选择院校</label>
            <Dropdown placeholder='院校' fluid search selection options={this.state.colleges}/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

export default Mentor;
