import React, { Component } from 'react';
import axios from 'axios';
import './industry.css';

class Industry extends Component {

  constructor (props) {
    super(props);

    this.state={industries:[]};
    axios.post('http://localhost:3005/api/industry_list',{}).then(res => {
      console.log('FUCK!!');
      console.log(res);
      if(res.data.code==0){
        console.log(res.data.list);
        this.setState({industries:res.data.list});
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  render() {
    return (
      <div>
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
          {
            this.state.industries.map(el => (<a className="item" key={el.id}> {el.name} </a>))
          }
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
