import React, {Component} from 'react';
import {Button, Checkbox, Divider, Icon, Menu, Dropdown, Table} from 'semantic-ui-react';
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
        "majors": [],
        "colleges": []
      },
      isLoading: false,
      followees: [],
      results: [],
      filterPressed: false,
      keyword: '',
      left: 100
    };
    this.uid = 0;
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

  handleRemoveButton(e,title) {
    let curState = this.state;
    curState.selected[title] = []
    this.setState(curState);
    e.stopPropagation();
  }

  handleClearFilter(e,data){
    let curState = this.state;
    curState.selected.majors = [];
    curState.selected.colleges = [];
    this.setState(curState);
  }

  filterBarPressed(e, val) {
    let curState = this.state;
    curState.filterPressed = !curState.filterPressed;
    curState.keyword = val;

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
    // for search
    const { filterPressed, keyword, isLoading, left } = this.state
    console.log(this.state.selected[keyword]);

    console.log(this.props[keyword]);
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
            <div className="filter-item filter-item-all" onClick={(e) => this.filterBarPressed(e,"majors")}>
            <div className="item-central">Major{(this.state.selected.majors.length > 0) ? (" · " + this.state.selected.majors.length) : ""}</div>
            {
              (this.state.selected.majors.length > 0) ? ( <Icon className="delete-button"  name='repeat' onClick={(e)=> this.handleRemoveButton(e,"majors")}/>): (<div></div>)
            }
            </div>

            <div className="filter-item filter-item-all" onClick={(e) => this.filterBarPressed(e,"colleges")}>
            <div className="item-central">College{(this.state.selected.colleges.length > 0) ? (" · " + this.state.selected.colleges.length) : ""}</div>
            {
              (this.state.selected.colleges.length > 0) ? ( <Icon className="delete-button"  name='repeat' onClick={(e)=> this.handleRemoveButton(e,"colleges")}/>): (<div></div>)
            }
            </div>
            {
              (this.state.filterPressed) ? (
                <div className="filter-expand" style={{left: left+"px"}}>
                  <div className="content">
                  <Dropdown name='filter' placeholder='查一查' search selection multiple fluid closeOnChange
                            options={this.props[keyword]}
                            onChange={(e, data) =>
                              {
                                let curState = this.state;
                                curState.selected[keyword] = data.value
                                this.setState({curState});
                              }
                              }
                            value={this.state.selected[keyword]}
                            />
                          </div>
                </div>
              ) : (<div></div>)
            }

          </div>
        </div>
        <div className="content-container listitem">


              {this.props.mentors
                .filter((el) => (this.state.selected.majors.length === 0 || el.major.filter(e => this.state.selected.majors.indexOf(e) > -1).length > 0 ))
                .filter((el) => (this.state.selected.colleges.length === 0  || this.state.selected.colleges.indexOf(el.college_name) > -1)).map(el => (
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
                            <img className="title-icon"  alt="position" src={companyIcon} ></img>
                          </Table.Cell>
                          <Table.Cell>

                            <div className="card-info">  {el.offer_company}</div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            <img className="title-icon"  alt="position" src={posiIcon} ></img>
                          </Table.Cell>
                          <Table.Cell>

                            <div className="card-info">  {el.offer_title} </div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            <img className="title-icon"  alt="position" src={schoolIcon} ></img>
                          </Table.Cell>
                          <Table.Cell>

                              <div className="card-info">{el.college_name} </div>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row className="table-clean-row">
                          <Table.Cell>
                            <img className="title-icon"  alt="position" src={ageIcon} ></img>
                          </Table.Cell>
                          <Table.Cell>

                            <div className="card-info">  {el.major.join(', ')} </div>
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

                </div>
              ))}
            </div>
          

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {...state.mentorStore};
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
