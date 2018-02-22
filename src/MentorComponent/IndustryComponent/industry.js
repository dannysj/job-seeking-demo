import React, { Component } from 'react';
import './industry.css';

class Industry extends Component {
  render() {
    return (
      <div className="Industry">
        <div className="ui vertical menu">
          <div className="item">
            <div className="ui transparent icon input">
              <input type="text" placeholder="Search industry" />
              <i className="search icon"></i>
            </div>
          </div>
          <a className="item">
            All
          </a>
          <a className="item">
            Accounting
          </a>
          <a className="item">
            Computer Science
          </a>
          <a className="item">
            Mechanical Engineering
          </a>
          <a className="item">
            More ...
          </a>
        </div>
      </div>
    );
  }
}

export default Industry;
