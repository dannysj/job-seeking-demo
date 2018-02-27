import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header } from 'semantic-ui-react';
import '../account.css';

class AccountApply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {services: [], showAddServiceModal: false};
    this.tempService = {};

    // This binding is necessary to make `this` work in the callback
    this.addService = this.addService.bind(this);
    this.confirmAddService = this.confirmAddService.bind(this);
    this.cancelAddService = this.cancelAddService.bind(this);
    this.handleAddServiceForm = this.handleAddServiceForm.bind(this);
  }

  addService (e) {
    e.preventDefault();
    var curState = this.state;
    curState.showAddServiceModal = true;
    this.setState(curState);
  }

  confirmAddService(e) {
    e.preventDefault();
    var curState = this.state;
    curState.showAddServiceModal = false;
    curState.services.push(this.tempService);
    this.setState(curState);
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
            <form className="ui form">
              <div className="field">
                <label>院校名称：</label>
                <input type="text" name="college" placeholder="院校名称" />
              </div>
              <div className="field">
                <label>Offer职位：</label>
                <input type="text" name="offer_title" placeholder="Offer职位" />
              </div>
              <div className="field">
                <label>Offer企业：</label>
                <input type="text" name="offer_company" placeholder="Offer企业" />
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
                      this.state.services.map(service => (
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
                <textarea type="text" rows="8"></textarea>
              </div>
              <div className="field">
                <label>上传简历：</label>
                <label for="resume-input" className="ui button">
                  <i className="ui upload icon"></i>
                  上传简历
                </label>
                <input type="file" className="input-file" id="resume-input" />
              </div>



              <button className="ui button" type="submit">提交</button>
            </form>
          </div>
        );
    }
}

AccountApply.contextTypes = {
    router: PropTypes.object
};

export default AccountApply;
