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

  // handleAddition = (e, {value}) => {
  //   this.setState({
  //     college_list: [{text: value, value}, ...this.state.college_list]
  //   })
  // };

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
    return (<Dropdown name='cid' placeholder='院校名称' fluid search selection
                      // allowAdditions
                      loading={this.state.isLoadingCollegeList}
                      onSearchChange={this.handleSearchChange}
                      options={this.state.college_list.concat(this.state.custom_college)}
                      onChange={this.props.handleChange}
                      // onAddItem={this.handleAddition}
                      defaultValue={this.props.defaultValue.value}/>)
  }
}

export default CollegeSelector;