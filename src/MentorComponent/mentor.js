import React, {Component} from 'react';
import {Button, Dropdown, Icon} from 'semantic-ui-react';
import './mentor.less';
import {fetchMentorList} from "../redux/mentorListAction";
import store from "../redux";
import {connect} from "react-redux";
import MentorProfileContainer from './MentorProfileContainer'
import Loading from "../Components/Loading";

@connect(state => ({
  mentors: state.mentorListStore.mentors,
  majors: state.mentorListStore.majors,
  colleges: state.mentorListStore.colleges,
  isLoading: state.mentorListStore.isLoading
}))
class Mentor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {
        "majors": [],
        "colleges": []
      },
      filterPressed: false,
      keyword: '',
      left: 100,
      page: 1,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.saveState = this.saveState.bind(this);
  }

  componentWillMount() {
    store.dispatch(fetchMentorList());
    if (this.props.history.location.state) {
      if (this.props.history.location.state.page) {
    
      this.setState({page: this.props.history.location.state.page});
    }
    }
  }

  saveState() {

    this.props.history.push('/mentor',this.state)
  }

  toggle_outside = (e) => {
    this.setState({filterPressed: false});
  };

  handlePageChange = (e, {activePage}) => this.setState({page: activePage});

  handleRemoveButton = (e, title) => {
    let curState = this.state;
    curState.selected[title] = [];
    this.setState(curState);
    e.stopPropagation();
  };

  filterBarPressed = (e, val) => {
    let curState = this.state;
    curState.filterPressed = !curState.filterPressed;
    curState.keyword = val;
    if (val === "majors") {
      curState.left = this.instance_major.getBoundingClientRect().left;
    } else {
      curState.left = this.instance_college.getBoundingClientRect().left;
    }
    this.setState(curState);
  };

  handleSearchInputChange = (e, data) => {
    let curState = this.state;
    curState.selected[this.state.keyword] = data.value;
    this.setState({curState});
  }


  render() {
    const {filterPressed, keyword, left, selected} = this.state;

    const filteredMentors = this.props.mentors
      .filter((el) => (selected.majors.length === 0 || el.major.filter(e => selected.majors.indexOf(e) > -1).length > 0))
      .filter((el) => (selected.colleges.length === 0 || selected.colleges.indexOf(el.college_name) > -1));

    if (this.props.loading) {
      return (<Loading/>);
    }

    return (
      <div className="flex-container">
        <div className="ui top attached tabular menu top-bar">
          <div className="ui container inner-topbar">

            <div className="filter-item filter-item-all" onClick={(e) => this.filterBarPressed(e, "majors")}>
              <div className="item-central" ref={(el) => this.instance_major = el}>
                Major{(selected.majors.length > 0) ? (" · " + selected.majors.length) : ""}
              </div>
              {selected.majors.length > 0 && <Icon className="delete-button" name='repeat'
                                                   onClick={(e) => this.handleRemoveButton(e, "majors")}/>}
            </div>

            <div className="filter-item filter-item-all" onClick={(e) => this.filterBarPressed(e, "colleges")}>
              <div className="item-central" ref={(el) => this.instance_college = el}>
                College{(selected.colleges.length > 0) ? (" · " + selected.colleges.length) : ""}
              </div>
              {selected.colleges.length > 0 && <Icon className="delete-button" name='repeat'
                                                     onClick={(e) => this.handleRemoveButton(e, "colleges")}/>}
            </div>

            {
              (filterPressed) ? (
                <div className="filter-expand" style={{left: left + "px"}}>
                  <Dropdown name='filter' placeholder='查一查' search selection multiple fluid closeOnChange
                            options={this.props[keyword]}
                            onChange={this.handleSearchInputChange}
                            value={selected[keyword]}/>
                </div>
              ) : (<div></div>)
            }

          </div>
        </div>
        <div onClick={this.toggle_outside}>
          <MentorProfileContainer page={this.state.page} saveState={this.saveState} handlePageChange={this.handlePageChange} mentors={filteredMentors} />
        </div>
      </div>
    );
  }
}


export default Mentor;
