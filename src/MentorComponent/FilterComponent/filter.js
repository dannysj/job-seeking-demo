import React, { Component } from 'react';
import { Dropdown, Input } from 'semantic-ui-react'
import axios from 'axios';
import './filter.css';

class Filter extends Component {

  constructor (props) {
    super(props);

    this.state={industries:[]};
    axios.post('/api/industry_list',{}).then(res => {
      console.log('FUCK!!');
      console.log(res);
      if(res.data.code==0){
        console.log(res.data.list);
        var industries = [];
        res.data.list.forEach((industry) => {
          industries.push({value:industry.id, text:industry.name});
        });
        this.setState({industries:industries});
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  render() {
    return (
      <div class="filter-container">
        <h3>筛选导师：</h3>
        <label>选择领域</label>
        <Dropdown placeholder='领域' fluid search selection options={this.state.industries} />
        <br />
        <label>选择院校</label>
        <Dropdown placeholder='院校' fluid search selection options={this.state.schools} />
        <br />
        <p>年龄区间</p>
        <p>从{' '}<Input placeholder='最小年龄' /></p>
        <p>到{' '}<Input placeholder='最大年龄' /></p>
        <br />
        <p>价格区间</p>
        <p>从{' '}<Input placeholder='最小价格' /></p>
        <p>到{' '}<Input placeholder='最大价格' /></p>
        <br />
      </div>
    );
  }
}

export default Filter;
