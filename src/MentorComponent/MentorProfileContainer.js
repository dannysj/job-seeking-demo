import React, {Component} from 'react';
import {Pagination} from 'semantic-ui-react';
import MentorProfile from "./MentorProfile";

class MentorProfileContainer extends Component {
  itemsPerPage = 12;

  constructor(props) {
    super(props);
    this.state = {
      totalPages: Math.ceil(this.props.mentors.length / this.itemsPerPage)
    };

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.mentors.length !== this.props.mentors.length)
      this.setState({

        totalPages: Math.ceil(this.props.mentors.length / this.itemsPerPage)
      })
  }

  handlePageChange = (e, {activePage}) => this.setState({page: activePage});

  render() {
    const start = (this.props.page - 1) * this.itemsPerPage;
    const end = this.props.page * this.itemsPerPage;
    const mentors = this.props.mentors.slice(start, end);

    return (
      <div className="content-container listitem">
        {mentors.map(el => <MentorProfile mentor={el} saveState={this.props.saveState} key={el.mid}/>)}
        <br/>
        {this.state.totalPages !== 1 &&
        <Pagination activePage={this.props.page}
                    totalPages={this.state.totalPages}
                    onPageChange={this.props.handlePageChange}
                    className="page-bottom"/>}
      </div>
    );
  }
}

export default MentorProfileContainer
