import React, { Component } from 'react';
import './mentor.css';
import Industry from './IndustryComponent/industry';
import List from './ListComponent/list';

class Mentor extends Component {
  render() {
    return (
      <div className="ui container">
        <div>
          <List></List>
        </div>
        <div className="ui right internal rail Industry-container">
          <Industry></Industry>
        </div>
      </div>
    );
  }
}

export default Mentor;
