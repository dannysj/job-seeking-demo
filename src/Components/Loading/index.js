import React, {Component} from 'react';
import {Button} from "semantic-ui-react";
import './index.less'

class Loading extends Component {
  render() {
    return (
      <div className="loading-view">
        <Button basic loading>Loading</Button>
      </div>
    );
  }
}

export default Loading;