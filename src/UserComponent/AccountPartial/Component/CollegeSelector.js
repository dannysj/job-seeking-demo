import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import axios from "axios/index";
import {NotificationManager} from "react-notifications";

class CollegeSelector extends Component {
  state = {
    college_list: [],
    custom_college: this.props.defaultValue,
    searchQuery: "",
    isLoadingCollegeList: false,
  };
  timer = null;

  componentWillMount(){
    this.triggerSearch()
  }

  handleAddition = (e, {value}) => {
    axios.post('/api/add_college', {college_name: value}).then(res => {
      if (res.data.code === 0) {
        const {id, name}= res.data.college;
        this.setState({custom_college: {key: id, text: name, value: name}})
      } else {
        NotificationManager.error('无法添加大学', '错误');
      }
    }).catch(e => {
      NotificationManager.error('无法添加大学', '错误');
    })
  };

  handleSearchChange = (e, {searchQuery}) => {
    clearTimeout(this.timer);
    this.setState({searchQuery: searchQuery});
    this.timer = setTimeout(this.triggerSearch, 300);
  };

  triggerSearch = () => {
    this.setState({isLoadingCollegeList: true});

    axios.post('/api/get_college_list', {query: this.state.searchQuery}).then(res => {
      if (res.data.code === 0) {
        this.setState({college_list: res.data.list});
      } else {
        NotificationManager.error('无法获取大学列表', '错误');
      }
      this.setState({isLoadingCollegeList: false})
    });
  };


  render() {
    const college_list = [...this.state.college_list, this.state.custom_college];
    return (<Dropdown name='cid' placeholder='院校名称' fluid search selection
                      allowAdditions
                      loading={this.state.isLoadingCollegeList}
                      onSearchChange={this.handleSearchChange}
                      options={college_list}
                      onChange={this.props.handleChange}
                      onAddItem={this.handleAddition}
                      defaultValue={this.state.custom_college.value}/>)
  }
}

export default CollegeSelector;