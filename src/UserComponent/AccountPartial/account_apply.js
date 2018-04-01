import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import '../account.css';

class AccountApply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hadApplied: false,
      pendingApplication: false,
      mentor_info:
      {
        services: [],
        uid: this.props.user.id
      },
      showAddServiceModal: false
    };
    this.tempService = {};

    // This binding is necessary to make `this` work in the callback
    this.addService = this.addService.bind(this);
    this.confirmAddService = this.confirmAddService.bind(this);
    this.cancelAddService = this.cancelAddService.bind(this);
    this.handleAddServiceForm = this.handleAddServiceForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    axios.post('/api/get_college_list').then(res => {
      if(res.data.code==0){
        console.log(res.data.list);
        let college_list = [];
        res.data.list.forEach((college)=>{
          college_list.push({
            value: college.id,
            text: college.name
          });
        });
        this.setState({college_list:college_list});
      }
      else{
        //TODO: Error Handling
      }
    });

    axios.post('/api/get_application_status', {uid: this.props.user.id}).then(res => {
      if(res.data.code==0){
        if(res.data.status == 1){
          this.setState({hadApplied: true, pendingApplication: true});
        }
        else if(res.data.status == 2){
          this.setState({hadApplied: true, pendingApplication: false});
        }
      }
      else{
        //TODO: Error Handling
      }
    });
  }

  addService (e) {
    e.preventDefault();
    this.setState({showAddServiceModal:true});
  }

  confirmAddService(e) {
    e.preventDefault();
    let curServices = this.state.mentor_info.services.slice();
    let service = Object.assign({}, this.tempService);
    let curInfo = this.state.mentor_info;
    curServices.push(service);
    curInfo.services = curServices;
    this.setState({mentor_info:curInfo,showAddServiceModal : false});
  }

  cancelAddService(e) {
    e.preventDefault();
    var curState = this.state;
    curState.showAddServiceModal = false;
    this.setState(curState);
  }

  handleAddServiceForm(e) {
    this.tempService[e.target.name] = e.target.value;
  }

  handleChange(e, data) {

    let curState = this.state;
    if(data){
      curState.mentor_info[data.name] = data.value;
    }
    else{
      curState.mentor_info[e.target.name] = e.target.value;
    }
    this.setState(curState);
  }

  handleResume(e) {
    var reader = new FileReader();
    var curState = this.state;
    var handler = this;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {

      curState.mentor_info['resume'] = reader.result;
      handler.setState(curState);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.mentor_info);
    axios.post('/api/mentor_apply',this.state.mentor_info).then(res => {
      if(res.data.code==0){
        alert('success');
        this.context.router.history.push('/account');
        // TODO:
      }
      else{
        //TODO: Error Handling
      }
    });
  }

    render() {
      let modalClassName='ui modal';
      if(this.state.showAddServiceModal){
        modalClassName += ' add-service-container';
      }
        return(
          <div>
            <div className={modalClassName}>
              <i className="close icon"></i>
              <div className="header">
                添加服务
              </div>
              <div className="add-service-form-container">
                <form className="ui form">
                  <div className="field">
                    <label>服务名称：</label>
                    <input type="text" name="name" placeholder="服务名称" onChange={this.handleAddServiceForm} />
                  </div>
                  <div className="field">
                    <label>服务价格：</label>
                    <input type="text" name="price" placeholder="服务价格" onChange={this.handleAddServiceForm} />
                  </div>
                  <div className="field">
                    <label>服务描述：</label>
                    <textarea type="text" name="description" rows="4" onChange={this.handleAddServiceForm} ></textarea>
                  </div>
                </form>
              </div>
              <div className="actions">
                <div className="ui black deny button" onClick={this.cancelAddService}>
                  取消
                </div>
                <div className="ui positive right labeled icon button" onClick={this.confirmAddService}>
                  添加
                  <i className="checkmark icon"></i>
                </div>
              </div>
            </div>
            <h4>申请成为导师</h4>
            {this.state.hadApplied&&<b className="notification-msg">您已经提交申请，请勿重复提交</b>}
            <form className="ui form">
              <div className="field">
                <label>院校名称：</label>
                <Dropdown name='cid' placeholder='院校名称' fluid search selection options={this.state.college_list} onChange={this.handleChange} />
              </div>
              <div className="field">
                <label>Offer职位：</label>
                <input type="text" name="offer_title" placeholder="Offer职位" onChange={this.handleChange} />
              </div>
              <div className="field">
                <label>Offer企业：</label>
                <input type="text" name="offer_company" placeholder="Offer企业" onChange={this.handleChange} />
              </div>
              <div className="field">
                <label>提供服务：</label>
                <table class="ui celled table">
                  <thead>
                    <tr><th>服务名称</th>
                    <th>服务价格</th>
                    <th>具体介绍</th>
                  </tr></thead>
                  <tbody>
                    {
                      this.state.mentor_info.services.map(service => (
                        <tr>
                          <td>{service.name}</td>
                          <td>{service.price}</td>
                          <td>{service.description}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <button className="ui button" onClick={this.addService}>+添加服务</button>
              </div>
              <div className="field">
                <label>自我介绍：</label>
                <textarea type="text" rows="8" name="bio" onChange={this.handleChange}></textarea>
              </div>
              <div className="field">
                <label>上传简历：</label>
                <label for="resume-input" className={this.state.mentor_info.resume?'ui button positive':'ui button'}>
                  <i className="ui upload icon"></i>
                  {this.state.mentor_info.resume?'成功':'上传简历'}
                </label>
                <input type="file" className="input-file" id="resume-input" onChange={this.handleResume} />
              </div>
              {this.state.hadApplied?<Button disabled>提交</Button>:
              <button className="ui button" type="submit" onClick={this.handleSubmit}>提交</button>}
            </form>
          </div>
        );
    }
}

AccountApply.contextTypes = {
    router: PropTypes.object
};

export default AccountApply;
