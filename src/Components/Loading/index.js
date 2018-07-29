import React from 'react';
import {Button} from "semantic-ui-react";
import './index.less'

function Loading() {
  return (
    <div className="loading-view">
      <Button basic loading>Loading</Button>
    </div>
  );
}

export default Loading;