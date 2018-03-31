import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react'
import '../account.css';

class AccountProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddServiceModal: false
    };
    this.tempService = {};

    // This binding is necessary to make `this` work in the callback
    this.initAttrChange = this.initAttrChange.bind(this);
    this.confirmAttrChange = this.confirmAttrChange.bind(this);
    this.cancelAttrChange = this.cancelAttrChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  initAttrChange (e) {
    e.preventDefault();
    console.log(e.target);
    this.setState({attr_key:e.target.key, showAddServiceModal:true});
  }

  confirmAttrChange(e) {
    e.preventDefault();
    // TODO: Process and upload data
    this.setState({showAddServiceModal : false});
  }

  cancelAttrChange(e) {
    e.preventDefault();
    var curState = this.state;
    curState.showAddServiceModal = false;
    this.setState(curState);
  }

  handleInputChange(e, data) {
    this.attr_val = e.target.value;
  }

    render() {
      let modalClassName='ui modal';
      if(this.state.showAddServiceModal){
        modalClassName += ' add-service-container';
      }
        return(
            <div className="ui large celled list">
              <div className={modalClassName}>
                <i className="close icon"></i>
                <div className="header">
                  {this.state.attr_key}
                </div>
                <div className="add-service-form-container">
                  <form className="ui form">
                    <div className="field">
                      <label>{this.state.attr_key}：</label>
                      <input type="text" name="name" onChange={this.handleInputChange} />
                    </div>
                  </form>
                </div>
                <div className="actions">
                  <div className="ui black deny button" onClick={this.cancelAttrChange}>
                    取消
                  </div>
                  <div className="ui positive right labeled icon button" onClick={this.confirmAttrChange}>
                    确认
                    <i className="checkmark icon"></i>
                  </div>
                </div>
              </div>
              <div className="item">
                <img className="ui medium image profile_pic" src={this.props.user.profile_pic}></img>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">姓{' '}<Button name='last' onClick={this.initAttrChange}><Icon name='write' size='small' /></Button></div>
                  <div className="info">{this.props.user.last}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">名</div>
                  <div className="info">{this.props.user.first}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">Email</div>
                  <div className="info">{this.props.user.email}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">理想行业</div>
                  <div className="info">...</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">出生日期</div>
                  <div className="info">{this.props.user.dob}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">注册日期</div>
                  <div className="info">{this.props.user.register_date}</div>
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="header">自我介绍</div>
                  <div className="info">{this.props.user.cover}</div>
                </div>
              </div>
            </div>
        );
    }
}

AccountProfile.contextTypes = {
    router: PropTypes.object
};

export default AccountProfile;
