import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

class ErrorPage extends Component {

  render() {
    return (
      <div className="error-index">
      <div className="clouds">
           <div className="cloud"></div>
           <div className="cloud"></div>
           <div className="cloud"></div>
           <div className="cloud"></div>
           <div className="cloud"></div>
           <div className="cloud"></div>
       </div>
        <div className="card">
           <div className="title logo-item">
           {"哎哟，出错啦～"}
           </div>
           <div className="error-code">
           </div>
         </div>
       </div>
    );
  }
}

export default ErrorPage;
