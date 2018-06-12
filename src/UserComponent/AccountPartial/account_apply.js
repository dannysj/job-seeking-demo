import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'semantic-ui-react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../account.css';

//TODO: Bugs: Description text is not blank on next form input after submit edit
//TODO: verification

class AccountApply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusChecked: false,
      hasNotApplied: false,
      mentor_info:
        {
          services: [],
          uid: this.props.user.id
        },
      showAddServiceModal: false,
      editMode: false,
      editIndex: -1,
      college_list : [],
      collegeQuery: "",
      isLoadingCollegeList: false
    };
    this.tempService = {};
    this.formRef = null;
    this.timer = null;

    // This binding is necessary to make `this` work in the callback
    this.addService = this.addService.bind(this);
    this.confirmAddService = this.confirmAddService.bind(this);
    this.cancelAddService = this.cancelAddService.bind(this);
    this.handleAddServiceForm = this.handleAddServiceForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRowAt = this.deleteRowAt.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    axios.post(process.env.REACT_APP_API_HOST + '/api/get_mentor_detail_by_uid', {uid: this.props.user.id}).then(res => {
      if (res.data.code === 0) {
        let mentor = res.data.mentor;
        mentor.services = mentor.service; // Sorry for the terrible naming
        this.setState({mentor_info: mentor, statusChecked:true, hasNotApplied: false});
      }
      else {
        if(res.data.code == 55){
          this.setState({statusChecked: true, hasNotApplied: true});
        }
        else{
          NotificationManager.error('数据库错误', '错误')
        }
      }
    });
  }

  addService(e) {
    e.preventDefault();
    this.formRef.description.value = "";
    this.formRef.reset();
    this.setState({editMode: false, showAddServiceModal: true});
  }

  confirmAddService(e) {
    e.preventDefault();
    let curServices = this.state.mentor_info.services.slice();
    let curState = this.state;
    let service = Object.assign({}, this.tempService);
    let curInfo = this.state.mentor_info;
    if (curState.editMode) {
      curServices[curState.editIndex] = service;

      this.setState({editMode: false, editIndex: -1});
    } else {
      curServices.push(service);
    }
    this.tempService = {};
    curInfo.services = curServices;
    this.setState({mentor_info: curInfo, showAddServiceModal: false});
    this.formRef.description.value = "";
    this.formRef.reset();

  }

  cancelAddService(e) {
    e.preventDefault();
    let curState = this.state;
    curState.showAddServiceModal = false;

    if (curState.editMode) {
      curState.editIndex = -1;
      curState.editMode = false;
    }
    this.tempService = {};
    this.setState(curState);
    this.formRef.description.value = "";
    this.formRef.reset();
  }

  handleAddServiceForm(e) {
    this.tempService[e.target.name] = e.target.value;
  }



  handleSearchChange = (e, {searchQuery}) =>{
    clearTimeout(this.timer);

    this.setState({collegeQuery: searchQuery});

    this.timer = setTimeout(this.triggerSearch, 500);
  };

  triggerSearch = () =>{
    this.setState({isLoadingCollegeList : true});

    axios.post(process.env.REACT_APP_API_HOST + '/api/get_college_list', {query: this.state.collegeQuery}).then(res => {
      if (res.data.code === 0) {
        this.setState({college_list: res.data.list});
      } else {
        NotificationManager.error('无法获取大学列表', '错误');
      }
      this.setState({isLoadingCollegeList : false})
    });
  }

  handleChange(e, data) {
    let curState = this.state;
    if (data) {
      curState.mentor_info[data.name] = data.value;
    }
    else {
      curState.mentor_info[e.target.name] = e.target.value;
    }
    this.setState(curState);
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.state.mentor_info.num_weekly_slots < 0){
      NotificationManager.error('每周愿意服务次数必须为自然数','错误');
      return;
    }

    const apiUrl = this.state.hasNotApplied ? '/api/mentor_apply' : '/api/mentor_edit';

    axios.post(process.env.REACT_APP_API_HOST + apiUrl, this.state.mentor_info).then(res => {
      if (res.data.code === 0) {
        NotificationManager.success('我们已收到您的表格','成功');
      }
      else {
        if(res.data.code == 45) {
          NotificationManager.error('请先完善您的基础资料','错误');
        }
        else{
          NotificationManager.error('数据库错误','错误');
        }
      }
    });
  }

  deleteRowAt(index) {
    let curServices = this.state.mentor_info.services.slice();
    let curInfo = this.state.mentor_info;
    curServices.splice(index, 1);
    curInfo.services = curServices;
    this.setState({mentor_info: curInfo, showAddServiceModal: false});
  }

  handleEdit(index) {
    let curServices = this.state.mentor_info.services.slice();
    this.tempService = curServices[index]

    this.setState({editMode: true, editIndex: index, showAddServiceModal: true});
  }

  render() {
    let modalClassName = 'ui modal';
    if (this.state.showAddServiceModal) {
      modalClassName += ' add-service-container';

    }

    var editName = this.tempService['name'];
    var editPrice = this.tempService['price'];
    var editDesc = this.tempService['description'];

    return (
      !this.state.statusChecked?("请稍后..."):(
        <div className="account-inner-spacing">
        <NotificationContainer />
        <div className={modalClassName}>
          <i className="close icon"/>
          <div className="header">
            添加服务
          </div>
          <div className="add-service-form-container">
            <form className="ui form" ref={(el) => this.formRef = el}>
              <div className="field">
                <label>服务名称：</label>
                <input type="text" name="name" defaultValue={editName} placeholder= "服务名称" onChange={this.handleAddServiceForm}/>
              </div>
              <div className="field">
                <label>服务价格：</label>
                <input type="text" name="price" placeholder="服务价格" defaultValue={editPrice} onChange={this.handleAddServiceForm}/>
              </div>
              <div className="field">
                <label>服务描述：</label>
                <textarea name="description" rows="4" defaultValue={editDesc} onChange={this.handleAddServiceForm} />
              </div>
            </form>
          </div>
          <div className="actions">
            <div className="ui black deny button" onClick={this.cancelAddService}>
              取消
            </div>
            <div className="ui positive right labeled icon button" onClick={this.confirmAddService}>
              添加
              <i className="checkmark icon"/>
            </div>
          </div>
        </div>
        {!this.state.hasNotApplied ? <h4>我们已经收到了您的申请，您仍可以在此修改您的申请表格</h4>:
          <h4>申请成为导师</h4>}
        <form className="ui form">
          <div className="field">
            <label>院校名称：</label>
            <b className="notification-msg">
              <Dropdown name='cid' placeholder='院校名称' fluid search selection
                        loading={this.state.isLoadingCollegeList}
                        noResultsMessage={null}
                        options={this.state.college_list}
                        onChange={this.handleChange}
                        selectedValue={this.state.mentor_info.college_name}
                        onSearchChange={this.handleSearchChange}/>
            </b>
          </div>
          <div className="field">
            <label>Offer职位：</label>
            <input type="text" name="offer_title" placeholder="Offer职位" onChange={this.handleChange}
                   value={this.state.mentor_info.offer_title} required/>
          </div>
          <div className="field">
            <label>Offer企业：</label>
            <input type="text" name="offer_company" placeholder="Offer企业" onChange={this.handleChange}
                   value={this.state.mentor_info.offer_company} required/>
          </div>
          <div className="field">
            <label>每周愿意服务次数：</label>
            <input type="number" name="num_weekly_slots" placeholder="服务次数" onChange={this.handleChange}
                   value={this.state.mentor_info.num_weekly_slots} required/>
          </div>
          <div className="field">
            <label>提供服务：</label>
            <table className="ui celled table">
              <thead>
              <tr>
                <th>服务名称</th>
                <th>服务价格</th>
                <th>具体介绍</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.mentor_info.services.map((service,i) => (
                  <tr>
                    <td>{service.name}</td>
                    <td>{service.price}</td>
                    <td>{service.description}</td>
                    <td><label onClick={() => this.handleEdit(i)} >编辑</label><label> | </label><label onClick={() => this.deleteRowAt(i)} >删除</label></td>
                  </tr>
                ))
              }
              </tbody>
            </table>
            <button className="ui button" onClick={this.addService}>+添加服务</button>
          </div>
          <div className="field">
            <label>自我介绍：</label>
            <textarea rows="8" name="bio" onChange={this.handleChange} value={this.state.mentor_info.bio}/>
          </div>
          {!this.state.hasNotApplied ? <button className="ui button" type="submit" onClick={this.handleSubmit}>更新</button> :
            <button className="ui button" type="submit" onClick={this.handleSubmit}>申请</button>}
        </form>
      </div>)
    );
  }
}

AccountApply.contextTypes = {
  router: PropTypes.object
};

export default AccountApply;
