import React, {Component} from 'react';
import {Sidebar, Checkbox, Segment, Menu, Icon, Button, Dropdown} from 'semantic-ui-react';
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
          "major": "Computer Science",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        }
        ,
        {
          "id": 13,
          "last": "As",
          "first": "saB",
          "offer_company": "Microsoft",
          "offer_title": "sla123cker",
          "college_name": "Chicago",
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
          "major": "WTF",
          "profile_pic": "/files/1522644897461-B_Business_Management_banner_template_01.jpg"
        }
      ],
      majors: ["CS", "Computer Science", "WTF", "Hi"],
      colleges: ["UW-Madison", "Chicago"],
      selected: {
        "Majors": [],
        "Colleges": []
      },
      filterBarShown: false,
    };

    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleCollegeChange = this.handleCollegeChange.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.filterBarPressed = this.filterBarPressed.bind(this);
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
    var majors = curState.selected.Majors;
    if (data.checked) {
      majors.push(data.value);
      console.log(data.value);
    } else {
      var index = majors.indexOf(data.value);
      if (index > -1) {
        majors.splice(index, 1);
      }
    }
    this.setState(curState);
  }

  handleCollegeChange(e,data){
    let curState = this.state;
    var colleges = curState.selected.Colleges;
    if (data.checked) {
      colleges.push(data.value);
      console.log(data.value);
    } else {
      var index = colleges.indexOf(data.value);
      if (index > -1) {
        colleges.splice(index, 1);
      }
    }

    this.setState(curState);
  }

  handleClearFilter(e,data){
    let curState = this.state;
    curState.selected.Majors = [];
    curState.selected.Colleges = [];
    this.setState(curState);
  }

  filterBarPressed(e) {
    let curState = this.state;
    curState.filterBarShown = !curState.filterBarShown;
    console.log("Pressed");
    console.log(curState.filterBarShown );
    this.setState(curState);
  }

  render() {
    //var blackout = this.state.search ? "blackout " : "";
    return (
      <div className="flex-container">
        <div className="ui top attached tabular menu top-bar">
          <div className="ui container">
          {
            (this.state.selected.Majors.length > 0) ? (this.state.selected.Majors.map((el, index) => (
              <div className="filter-item" key={index} onClick={this.filterBarPressed}>
                <div className="filter-item-content">
                  <div className="item-top">Major</div>
                  <div className="item-bottom">{el}</div>
                </div>
                <Icon className="delete-button" size="large" name='close' />
              </div>))
            ) : (<div className="filter-item" onClick={this.filterBarPressed}>
            <div className="item-central">All Majors</div>
            </div>)

          }
          {
            (this.state.selected.Colleges.length > 0) ? (this.state.selected.Colleges.map((el,index) => (
              <div className="filter-item" key={index} onClick={this.filterBarPressed}>
              <div className="item-top">College</div>
              <div className="item-bottom">{el}</div>
              <Icon className="delete-button" size="large" name='close' />
              </div>))
            ) : (<div className="filter-item" onClick={this.filterBarPressed}>
            <div className="item-central">All College</div>
            </div>)
          }
            <div className="filter-item" onClick={this.filterBarPressed}>  <div className="item-central">More Filters</div></div>
          </div>
        </div>
        <div className="content-container">
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='scale down' width='wide' visible={this.state.filterBarShown} icon='labeled' vertical className="sidebar-container">
            <Menu.Item name='home'>
              <Icon color="blue" size="big" name='code' /> Majors
              <div className="section-container">
              {
                this.state.majors.map((el, index) => (
                  <Checkbox key={index} value={el} onChange={this.handleMajorChange} label={<label>{el}</label>} />
                ))
              }
              </div>
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
              <div className="section-container">
              {
                this.state.colleges.map((el) => (
                  <Checkbox value={el} onChange={this.handleCollegeChange} label={<label>{el}</label>} />
                ))
              }
              </div>
            </Menu.Item>
            <Menu.Item name='buttons'  className="button-group">
              <Button.Group size='medium' fluid>
                <Button onClick={this.filterBarPressed}>Cancel</Button>
                <Button.Or />
                <Button onClick={this.handleClearFilter}>Reset</Button>
                <Button.Or />
                <Button color='green'>Submit</Button>
              </Button.Group>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
            <div className="ui container listitem">
              {this.state.mentors
                .filter((el) => (this.state.selected.Majors.length == 0 || this.state.selected.Majors.indexOf(el.major) > -1))
                .filter((el) => (this.state.selected.Colleges.length == 0  || this.state.selected.Colleges.indexOf(el.college_name) > -1)).map(el => (
                <div className="mentor-container" key={el.id}>
                    <div className="inner-container">
                    <div className="mentor-profile">
                      <img className="mentor-picture" src={el.profile_pic}/>
                      <br />
                      <div><strong>{el.last + ' '}{el.first}</strong></div>
                    </div>
                    <div className="vertical-divider"></div>
                    <div className="mentor-text">
                      <table>
                        <tbody>
                          <tr>
                            <th>Offer公司</th>
                            <th>{el.offer_company}</th>
                          </tr>
                          <tr>
                            <th>Offer职位</th>
                            <th>{el.offer_title}</th>
                          </tr>
                          <tr>
                            <th>院校</th>
                            <th>{el.college_name}</th>
                          </tr>
                          <tr>
                            <th>专业</th>
                            <th>{el.major}</th>
                          </tr>
                        </tbody>
                      </table>
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
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>



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
<div className={blackout}></div>
<div className="filter-container">
  <div className="filter-list">
  </div>
  <div className="button-group">
  <Button.Group size='medium' fluid>
    <Button>Cancel</Button>
    <Button.Or />
    <Button>Reset</Button>
    <Button.Or />
    <Button color='green'>Submit</Button>
  </Button.Group>
  </div>
</div>

*/
