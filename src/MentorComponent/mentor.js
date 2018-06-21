import React, {Component} from 'react';
import {Button, Checkbox, Divider, Icon, Menu, Segment, Sidebar, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import './mentor.css';
import axios from "axios/index";
import {fetchMentorList} from "../redux/mentorListAction";
import store from "../redux";
import {connect} from "react-redux";

//import { createFollowerFolloweeRelationship } from '../../server/db/module/follow_relation';


class Mentor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {
        "Majors": [],
        "Colleges": []
      },
      filterBarShown: false,
      followees: []
    };
    this.uid = 0;
    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleCollegeChange = this.handleCollegeChange.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.filterBarPressed = this.filterBarPressed.bind(this);
    this.handleRemoveButton = this.handleRemoveButton.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.follow_action = this.follow_action.bind(this);
    this.unfollow_action = this.unfollow_action.bind(this);
    /*axios.post('/api/get_followees_by_uid', {account: 0}.then(
      res =>{
        if (res.data.code === 0){
          this.setState({
            followees = res.data.followees
          })
        }
        else{
          this.setState ({
            followees = []
          })
        }
        }
      )
    )*/

  }

  componentWillMount(){
    store.dispatch(fetchMentorList());
  }

  handleMajorChange(e, data){
    let curState = this.state;
    var majors = curState.selected.Majors;
    var index = majors.indexOf(data.value);
    if (data.checked) {
      if (index < 0) {
        majors.push(data.value);
      }
    } else {

      if (index > -1) {
        majors.splice(index, 1);
      }
    }
    this.setState(curState);
  }

  handleCollegeChange(e,data){
    let curState = this.state;
    var colleges = curState.selected.Colleges;
    var index = colleges.indexOf(data.value);
    if (data.checked) {
      if (index < 0) {
        colleges.push(data.value);
      }
    } else {

      if (index > -1) {
        colleges.splice(index, 1);
      }
    }

    this.setState(curState);
  }

  handleRemoveButton(e,title, val) {
    let curState = this.state;
    var array = curState.selected[title]
    var index = array.indexOf(val);
    if (index > -1) {
          array.splice(index, 1)
    }

    this.setState(curState);
    e.stopPropagation();
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
    this.setState(curState);
  }

 follow_action(uid, mentor_uid){
    // axios.post('/api/create_follower_followee_relationship', {follower_uid:uid , followee_uid: mentor_uid} )
    //      .then(res=> ())
    //      .catch(err => console.log(err))
    console.log("Button click")
    let followees = this.state.followees;
    followees.push(mentor_uid);
    this.setState({followees: followees})
 }

unfollow_action(uid, mentor_uid){
    // axios.post('/api/delete_follower_followee_relationship', {follower_uid:uid , followee_uid: mentor_uid} )
    //      .then(res=> ())
    //      .catch(err => console.log(err))
    let followees = this.state.followees;
    let index = followees.indexOf(mentor_uid)
    if (index > -1){
      followees.splice(index, 1);
    }
    this.setState({followees: followees})

}

  renderFollowButton(mentor_uid){
    let followee_list = this.state.followees;
    if (followee_list.includes(mentor_uid)){
      return (
        // Need add onclick to delete the mentor_uid to table and reset state
        // onclick = {create}

        <button class="ui active button" onClick={()=>this.unfollow_action(0, mentor_uid)} >
        <i class="user icon"></i>
        Unfollow
        </button>
      )
    }
    else {
      // Need add onclick to add the mentor_uid to table and reset state
      return (
        <button class="ui active button" onClick={()=>this.follow_action(0, mentor_uid)}>
        <i class="user icon"></i>
        Follow
        </button>
      )
    }
  }

  render() {
    //var blackout = this.state.search ? "blackout " : "";
    const companyIcon = '/icons/company.png';
    const schoolIcon = '/icons/school.png';
    const posiIcon = '/icons/position.png';
    const ageIcon = '/icons/age.png';

    if (this.props.loading) {
      return (
        <div className="loading-news-view">
            <Button basic loading>Loading</Button>
        </div>
      );
    }
    else
    return (
      <div className="flex-container">
        <div className="ui top attached tabular menu top-bar">
          <div className="ui container inner-topbar">
          {
            (this.state.selected.Majors.length > 0) ? (this.state.selected.Majors.map((el, index) => (
              <div className="filter-item" key={index} onClick={this.filterBarPressed}>
                  <div className="item-top">Major</div>
                  <div className="item-bottom">{el}</div>
                <Icon className="delete-button" size="large" name='close' onClick={(e)=> this.handleRemoveButton(e,"Majors", el)}/>
              </div>))
            ) : (<div className="filter-item filter-item-all" onClick={this.filterBarPressed}>
            <div className="item-central">All Majors</div>
            </div>)

          }
          {
            (this.state.selected.Colleges.length > 0) ? (this.state.selected.Colleges.map((el,index) => (
              <div className="filter-item" key={index} onClick={this.filterBarPressed}>
              <div className="item-top">College</div>
              <div className="item-bottom">{el}</div>
              <Icon className="delete-button" size="large" name='close' onClick={(e)=> this.handleRemoveButton(e,"Colleges", el)}/>
              </div>))
            ) : (<div className="filter-item filter-item-all" onClick={this.filterBarPressed}>
            <div className="item-central">All College</div>
            </div>)
          }
            <div className="filter-item filter-item-all" onClick={this.filterBarPressed}>  <div className="item-central">More Filters</div></div>
          </div>
        </div>
        <div className="content-container">
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='scale down' width='wide' visible={this.state.filterBarShown} icon='labeled' vertical className="sidebar-container">
            <Menu.Item name='home' className="menu-container">
              <div className="header-container">
              <div className="section-header">Majors</div>
              <div className="section-container">
              {
                this.props.majors.map((el, index) => (
                  <Checkbox key={index} checked={(this.state.selected.Majors.indexOf(el) > -1)} value={el} onChange={this.handleMajorChange} label={<label>{el}</label>} />
                ))
              }
              </div>
              </div>
              <Divider/>
              <div className="header-container">
              <div className="section-header">Colleges</div>
              <div className="section-container">
              {
                this.props.colleges.map((el, index) => (
                  <Checkbox key={index} checked={(this.state.selected.Colleges.indexOf(el) > -1)}  value={el} onChange={this.handleCollegeChange} label={<label>{el}</label>} />
                ))
              }

              </div>
              </div>
            </Menu.Item>
            <Menu.Item name='buttons'  className="button-group">
              <Button.Group size='medium' fluid>
                <Button onClick={this.filterBarPressed}>Cancel</Button>
                <Button.Or />
                <Button onClick={this.handleClearFilter}>Reset</Button>
                <Button.Or />
                <Button onClick={this.filterBarPressed} color='green'>Submit</Button>
              </Button.Group>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
            <div className="ui container listitem">
              {this.props.mentors
                .filter((el) => (this.state.selected.Majors.length === 0 || el.major.filter(e => this.state.selected.Majors.indexOf(e) > -1).length > 0 ))
                .filter((el) => (this.state.selected.Colleges.length === 0  || this.state.selected.Colleges.indexOf(el.college_name) > -1)).map(el => (
                <div className="mentor-container" key={el.id}>
                    <div className="inner-container">
                    <div className="mentor-profile">
                      <img className="mentor-picture" src={el.profile_pic} alt=""/>
                      <br />
                      <div><strong>{el.last + ' '}{el.first}</strong></div>
                    </div>
                    <div className="vertical-divider"></div>
                    <div className="mentor-text">
                    <Table className="table-clean-border" basic='very'>
                      <Table.Body>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            Offer公司
                          </Table.Cell>
                          <Table.Cell>
                            <img className="title-icon"  alt="position" src={companyIcon} ></img>
                              {el.offer_company}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            Offer职位
                          </Table.Cell>
                          <Table.Cell>
                          <img className="title-icon"  alt="position" src={posiIcon} ></img>
                              {el.offer_title}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            院校
                          </Table.Cell>
                          <Table.Cell>
                          <img className="title-icon"  alt="position" src={schoolIcon} ></img>
                              {el.college_name}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            专业
                          </Table.Cell>
                          <Table.Cell>
                          <img className="title-icon"  alt="position" src={ageIcon} ></img>
                              {el.major.join(', ')}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>

                    </div>

                  </div>
                  <Link to={'/mentor/' + el.mid}>
                  <div className="connect-circle">
                    <div>详情</div>
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

const mapStateToProps = state => {
  const {mentor_list} = state;
  return {...mentor_list};
};

export default connect(mapStateToProps)(Mentor);

/*
<div className="ui right internal rail Filter-container">
  <div className="filter-container">
    <h3>筛选导师：</h3>
    <label>选择领域</label>
    <Dropdown placeholder='领域' fluid search selection options={this.props.majors} value={this.state.selectedMajor} onChange={this.handleMajorChange} />
    <br/>
    <label>选择院校</label>
    <Dropdown placeholder='院校' fluid search selection options={this.props.colleges} value={this.state.selectedCollege} onChange={this.handleCollegeChange}/>
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
