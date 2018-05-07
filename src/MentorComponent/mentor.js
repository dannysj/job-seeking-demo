import React, {Component} from 'react';
import {Button, Dropdown} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import './mentor.css';
import axios from "axios/index";

class Mentor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentors: [
        {
          "id": 1,
          "last": "A",
          "first": "B",
          "offer_company": "Microsoft",
          "offer_title": "slacker",
          "college_name": "UW-Madison",
          "major": "CS",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        },
        {
          "id": 2,
          "last": "12A",
          "first": "fasB",
          "offer_company": "Microsoft",
          "offer_title": "slacker",
          "college_name": "UW-Madison",
          "major": "CS",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        }
        ,
        {
          "id": 13,
          "last": "As",
          "first": "saB",
          "offer_company": "Microsoft",
          "offer_title": "sla123cker",
          "college_name": "UW-Madison",
          "major": "CS",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        }
        ,
        {
          "id": 5,
          "last": "A11",
          "first": "B",
          "offer_company": "123Microsoft",
          "offer_title": "slacker",
          "college_name": "UW-Madison",
          "major": "CS",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        }
      ],
      majors: [],
      colleges: [],
      selectedMajor: null,
      selectedCollege: null,
    };

    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleCollegeChange = this.handleCollegeChange.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
/*
    axios.post('/api/get_mentor_list').then(res => {
      if (res.data.code === 0) {
        let majorList = [];
        let collegeList = [];
        res.data.list.forEach((e) => {
          if(majorList.indexOf(e.major)< 0 && e.major !== "" && e.major !== null){
            majorList.push(e.major);
          }
          if (collegeList.indexOf(e.college_name) < 0) {
            collegeList.push(e.college_name);
          }
        });


        let majors = [];
        let colleges = [];
        majorList.forEach((e) => {majors.push({value: e, text: e});});
        collegeList.forEach((e) => {colleges.push({value: e, text: e});});

        this.setState({
          mentors: res.data.list,
          majors: majors,
          colleges: colleges
        });



      }
      else {
        //TODO: Error Handling
      }
    });
    */

  }

  handleMajorChange(e, data){
    let curState = this.state;
    curState.selectedMajor = data.value;
    this.setState(curState);
  }

  handleCollegeChange(e,data){
    let curState = this.state;
    curState.selectedCollege = data.value;
    this.setState(curState);
  }

  handleClearFilter(e,data){
    let curState = this.state;
    curState.selectedMajor = null;
    curState.selectedCollege = null;
    this.setState(curState);
  }

  render() {
    return (
      <div className="">
        <div className="ui top attached tabular menu top-bar">
          <div className="ui container">
            <div className="filter-item"></div>
          </div>
        </div>
        <div className="filter-container">
          <div className="filter-list">
          </div>

          <Button.Group size='medium' fluid>
            <Button>Cancel</Button>
            <Button.Or />
            <Button>Reset</Button>
            <Button.Or />
            <Button color='green'>Submit</Button>
          </Button.Group>

        </div>
        <div className="ui container listitem">
          {this.state.mentors
            .filter((el) => (this.state.selectedMajor===null || el.major===this.state.selectedMajor))
            .filter((el) => (this.state.selectedCollege===null || el.college_name===this.state.selectedCollege)).map(el => (
            <div className="mentor-container" key={el.id}>
                <div className="inner-container">
                <div className="mentor-profile">
                  <img className="mentor-picture" src={el.profile_pic}/>
                  <br />
                  <div><strong>{el.last + ' '}{el.first}</strong></div>
                </div>
                <div className="vertical-divider"></div>
                <div className="mentor-text">

                  <p>Offer公司: {el.offer_company}</p>
                  <p>Offer职位: {el.offer_title}</p>
                  <p>院校: {el.college_name}</p>
                  <p>专业: {el.major}</p>
                </div>

              </div>
              <Link to={'/mentor/' + el.mid}>
              <div className="connect-circle">
                <div>Connect</div>
              </div>
              </Link>
              <Link to={'/mentor/' + el.mid}>
                <div className="btm-more">
                  <div className="">More</div>
                  <div className="chinese-top">更多</div>
                </div>
              </Link>
            </div>
          ))}
        </div>


      </div>
    );
  }
}

export default Mentor;

/*
<div className="ui right internal rail Filter-container">
  <div className="filter-container">
    <h3>筛选导师：</h3>
    <label>选择领域</label>
    <Dropdown placeholder='领域' fluid search selection options={this.state.majors} value={this.state.selectedMajor} onChange={this.handleMajorChange} />
    <br/>
    <label>选择院校</label>
    <Dropdown placeholder='院校' fluid search selection options={this.state.colleges} value={this.state.selectedCollege} onChange={this.handleCollegeChange}/>
    <br/>
    <Button className="ui button right"  onClick={this.handleClearFilter}>清除筛选</Button>
  </div>
</div>
*/
