import React, {Component} from 'react';
import {Button, Pagination} from 'semantic-ui-react';
import MentorProfile from "./MentorProfile";
import {connect} from "react-redux";

@connect(state => ({
  isLoading: state.mentorListStore.isLoading
}))
class MentorProfileContainer extends Component {
  itemsPerPage = 10;

  constructor(props) {
    super(props);
    this.state = {page: 1};

    this.totalPages = this.props.mentors.length / this.itemsPerPage;
  }

  componentDidUpdate() {
    this.totalPages = this.props.mentors.length / this.itemsPerPage;
  }

  handlePageChange = (e, {activePage}) => this.setState({page: activePage});

  render() {
    const start = (this.state.page - 1) * this.itemsPerPage;
    const end =  this.state.page * this.itemsPerPage;
    const mentors = this.props.mentors.slice(start, end);


    if (this.props.loading) {
      return (
        <div className="loading-news-view">
          <Button basic loading>Loading</Button>
        </div>
      );
    }

    return (
      <div className="content-container listitem">
        {mentors.map(el => <MentorProfile mentor={el}/>)}
        <br/>
        <Pagination activePage={this.state.page} totalPages={this.totalPages} onPageChange={this.handlePageChange}/>
      </div>
    );
  }
}

export default MentorProfileContainer