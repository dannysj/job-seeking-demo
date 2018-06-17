import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown} from 'semantic-ui-react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../account.css';


class MentorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mentor_info:
        {
          services: [],
          uid: this.props.user.id
        },
      showAddServiceModal: false,
      mentor: {
        bio: null,
        college_name: null,
        offer_company: null,
        offer_title: null
      },
      editMode: false,
      editIndex: -1
    };
    this.tempService = {};
    this.formRef = null;

    // This binding is necessary to make `this` work in the callback
    this.addService = this.addService.bind(this);
    this.confirmAddService = this.confirmAddService.bind(this);
    this.cancelAddService = this.cancelAddService.bind(this);
    this.handleAddServiceForm = this.handleAddServiceForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteRowAt = this.deleteRowAt.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    axios.post('/api/get_college_list').then(res => {
      if (res.data.code === 0) {
        let college_list = [];
        res.data.list.forEach((college) => {
          college_list.push({
            value: college.id,
            text: college.name
          });
        });
        this.setState({college_list: college_list});
      }
      else {
        NotificationManager.error('无法获取大学列表', '错误');
      }
    });

    axios.post('/api/get_mentor_detail_by_uid', {uid: this.props.user.id}).then(res => {
      if (res.data.code === 0) {

        res.data.mentor.services = res.data.mentor.service; // sorry for the terrible naming.
        this.setState({
          mentor_info: res.data.mentor
        });
      }
      else {
        NotificationManager.error('无法获取Mentor信息', '错误');
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

    axios.post('/api/mentor_edit', this.state.mentor_info).then(res => {
      if (res.data.code === 0) {
        NotificationManager.success('已经更改了您的信息', '成功');
        this.context.router.history.push('/account/mentor_edit');
      }
      else {
        NotificationManager.error('无法连接到服务器', '错误');
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
    // let curServices2 = this.state.mentor_info.services.slice(index, index+1);
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
      <div>
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
        <h4>申请成为导师</h4>
        <form className="ui form">
          <div className="field">
            <label>院校名称：</label>
            <b className="notification-msg">
              <Dropdown name='cid' placeholder='院校名称' fluid search selection options={this.state.college_list}
                        onChange={this.handleChange} value={this.state.mentor_info.college_name}/>
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
          <button className="ui button" type="submit" onClick={this.handleSubmit}>更新</button>
        </form>
      </div>
    );
  }
}

MentorEdit.contextTypes = {
  router: PropTypes.object
};

export default MentorEdit;
