import React, { Component } from 'react';
import './mentor.css';
import Filter from './FilterComponent/filter';
import List from './ListComponent/list';

class Mentor extends Component {
  constructor (props) {
    super(props);
    this.state = {filter:{}};
  }

  render() {
    console.log(this.props);
    return (
      <div className="ui container">
        <div>
          <List filter={this.state.filter}/>
        </div>
        <div className="ui right internal rail Filter-container">
          <Filter/>
        </div>
      </div>
    );
  }
}

export default Mentor;
