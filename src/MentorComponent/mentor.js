import React, { Component } from 'react';
import './mentor.css';
import Filter from './FilterComponent/filter';
import List from './ListComponent/list';

class Mentor extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="ui container">
        <div>
          <List></List>
        </div>
        <div className="ui right internal rail Filter-container">
          <Filter></Filter>
        </div>
      </div>
    );
  }
}

export default Mentor;
