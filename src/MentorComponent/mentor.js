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
      colleges: [],
      selectedMajor: null,
      selectedCollege: null,
    };

    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleCollegeChange = this.handleCollegeChange.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);

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
      <div className="ui container">
        <div>
          {this.state.mentors
            .filter((el) => (this.state.selectedMajor===null || el.major===this.state.selectedMajor))
            .filter((el) => (this.state.selectedCollege===null || el.college_name===this.state.selectedCollege)).map(el => (
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
            <Dropdown placeholder='领域' fluid search selection options={this.state.majors} value={this.state.selectedMajor} onChange={this.handleMajorChange} />
            <br/>
            <label>选择院校</label>
            <Dropdown placeholder='院校' fluid search selection options={this.state.colleges} value={this.state.selectedCollege} onChange={this.handleCollegeChange}/>
            <br/>
            <Button className="ui button right"  onClick={this.handleClearFilter}>清除筛选</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Mentor;
