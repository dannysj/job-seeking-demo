import React, { Component } from 'react';
import './mentor.css';
import Industry from './IndustryComponent/industry';

class Mentor extends Component {
  render() {
    return (
      <div className="ui container">
        <div className="ui right internal rail">
          <Industry></Industry>
        </div>
      </div>
    );
  }
}

export default Mentor;
