import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Message, TextArea, Input} from 'semantic-ui-react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../account.less';

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
                    service: [],
                    uid: this.props.user.id
                },
            showAddServiceModal: false,
            editMode: false,
            editIndex: -1,
            college_list: [],
            user_college: [],
            collegeQuery: "",
            isLoadingCollegeList: false,
            tempService: {
                name: "",
                price: "",
                description : "",
            }
        };
        this.timer = null;
    }

    componentWillMount(){
        axios.post('/api/get_mentor_detail_by_uid',{},
            {headers:{access_token: this.props.user.access_token}}).then(res => {
            if (res.data.code  === 0) {
                let mentor = res.data.mentor;
                this.setState({
                    mentor_info: mentor,
                    statusChecked:true,
                    hasNotApplied: false,
                    user_college:[
                        {
                            value: mentor.cid,
                            text: mentor.college_name
                        }
                    ]
                });
            }
            else {
                if(res.data.code === 55){
                    this.setState({statusChecked: true, hasNotApplied: true});
                }
                else{
                    NotificationManager.error('数据库错误', '错误')
                }
            }
        });

        this.triggerSearch();
    }


    showAddServicePopup = (e) => {
        e.preventDefault();
        this.setState({editMode: false, showAddServiceModal: true});
    };

    showEditServicePopup = (index) => {
        this.setState({
            tempService: this.state.mentor_info.service[index],
            editMode: true,
            editIndex: index,
            showAddServiceModal: true
        });
    };

    resetServicePopup = () => {
        this.setState({
            tempService: {
                name: "",
                price: "",
                description : "",
            },
            showAddServiceModal: false,
            editMode: false,
            editIndex: -1
        })
    };

    confirmServiceChange = (e) => {
        e.preventDefault();

        const index = this.state.editMode ? this.state.editIndex : this.state.mentor_info.service.length;
        const service = Object.assign([], this.state.mentor_info.service, {[index]: this.state.tempService});

        this.setState({mentor_info: {...this.state.mentor_info, service},});

        this.resetServicePopup();
    };

    cancelServiceChange = (e) => {
        e.preventDefault();
        this.resetServicePopup();
    };

    deleteService = (index) => {
        let curServices = this.state.mentor_info.service.slice();
        let curInfo = this.state.mentor_info;
        curServices.splice(index, 1);
        curInfo.service = curServices;
        this.setState({mentor_info: curInfo, showAddServiceModal: false});
    };


    handleServiceInputChange = (e) => {
        this.setState({
            tempService: {...this.state.tempService, [e.target.name]: e.target.value},
        });
    };



    handleSearchChange = (e, {searchQuery}) =>{
        clearTimeout(this.timer);

        this.setState({collegeQuery: searchQuery});

        this.timer = setTimeout(this.triggerSearch, 500);
    };

    triggerSearch = () =>{
        this.setState({isLoadingCollegeList : true});

        axios.post('/api/get_college_list', {query: this.state.collegeQuery}).then(res => {
            if (res.data.code === 0) {
                this.setState({college_list: res.data.list});
            } else {
                NotificationManager.error('无法获取大学列表', '错误');
            }
            this.setState({isLoadingCollegeList : false})
        });
    };

    handleChange = (e, data) => {
        let curState = this.state;
        if (data) {
            curState.mentor_info[data.name] = data.value;
        }
        else {
            curState.mentor_info[e.target.name] = e.target.value;
        }
        this.setState(curState);
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.state.mentor_info.num_weekly_slots < 0){
            NotificationManager.error('每周愿意服务次数必须为自然数','错误');
            return;
        }

        const apiUrl = this.state.hasNotApplied ? '/api/mentor_apply' : '/api/mentor_edit';
        delete this.state.mentor_info["uid"];
        axios.post(apiUrl, this.state.mentor_info,
            {headers:{access_token: this.props.user.access_token}}).then(res => {
            if (res.data.code === 0) {
                NotificationManager.success('我们已收到您的表格','成功');
            }
            else {
                if(res.data.code === 45) {
                    NotificationManager.success('我们已收到您的表格，请尽快完善您的基础资料','成功');
                }
                else{
                    NotificationManager.error('数据库错误','错误');
                }
            }
        });
    };

    render() {

        let modalClassName = 'ui modal';
        if (this.state.showAddServiceModal) {
            modalClassName += ' add-service-container';
        }

    return (
      !this.state.statusChecked?("请稍后..."):(
        <div className="account-inner-spacing">

        <div className={modalClassName}>
          <i className="close icon"/>
          <div className="header">
            {this.state.editMode ? "编辑服务" : "添加服务"}
          </div>
          <div className="add-service-form-container">
            <form className="ui form">
              <div className="field">
                <label>服务名称：</label>
                <input type="text" name="name" placeholder= "服务名称" defaultValue={this.state.tempService.name} onChange={this.handleServiceInputChange}/>
              </div>
              <div className="field">
                <label>服务价格：</label>
                <input type="text" name="price" placeholder="服务价格" defaultValue={this.state.tempService.price} onChange={this.handleServiceInputChange}/>
              </div>
              <div className="field">
                <label>服务描述：</label>
                <TextArea name="description" rows="4" value={this.state.tempService.description} onChange={this.handleServiceInputChange} />
              </div>
            </form>
          </div>
          <div className="actions">
            <div className="ui black deny button" onClick={this.cancelServiceChange}>
              取消
            </div>
            <div className="ui positive right labeled icon button" onClick={this.confirmServiceChange}>
              {this.state.editMode ? "确认" : "添加"}
              <i className="checkmark icon"/>
            </div>
          </div>
        </div>
        <div className="category">
          <div className="header">
            <div className= "title">
              {(this.props.user && this.props.user.ismentor) ? '编辑导师资料' : '申请成为导师'}
            </div>
            <div className="subtitle">
            {!this.state.hasNotApplied ? (  <Message info>
                  <Message.Header>我们已经收到了您的表格，您仍可以在此修改您的申请表格</Message.Header>
                </Message>
              ): (<div></div>)
              }
            </div>

          </div>
        </div>

        <form className="ui form">
          <div className="category">
          <div className="item first">
          <div className="content">
            <div className="inner-content">
            <div className="header">院校名称</div>

            <b className="notification-msg">
              <Dropdown name='cid' placeholder='院校名称' fluid search selection
                        loading={this.state.isLoadingCollegeList}
                        noResultsMessage={null}
                        onSearchChange={this.handleSearchChange}
                        options={this.state.college_list.concat(this.state.user_college)}
                        onChange={this.handleChange}
                        value={this.state.mentor_info.cid}/>
            </b>
          </div>
          </div>
          </div>

          <div className="item ">
          <div className="content">
          <div className="inner-content">
            <div className="header">Offer职位</div>
            <input type="text" name="offer_title" placeholder="Offer职位" onChange={this.handleChange}
                   value={this.state.mentor_info.offer_title} required/>
                </div>
              </div>
            </div>
            <div className="item ">
            <div className="content">
          <div className="inner-content">
            <div className="header">Offer企业</div>
            <input type="text" name="offer_company" placeholder="Offer企业" onChange={this.handleChange}
                   value={this.state.mentor_info.offer_company} required/>
          </div>
          </div>
          </div>
          </div>
          <div className="category">
          <div className="subheader">
            <div className="title">
              服务设置
            </div>
            <div className="subtitle">
              这里展示你的服务潜能噢
            </div>
          </div>
          <div className="item first">
          <div className="content">
          <div className="inner-content">
            <div className="header">每周愿意服务次数</div>
            <input type="number" name="num_weekly_slots" placeholder="服务次数" onChange={this.handleChange}
                   value={this.state.mentor_info.num_weekly_slots} required/>
          </div>
          </div>
          </div>

          <div className="item">
          <div className="content">
            <div className="inner-content">
            <div className="header">提供服务</div>
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
                this.state.mentor_info.service.map((service, i) =>
                {
                  return (
                    <tr>
                      <td>{service.name}</td>
                      <td>{service.price}</td>
                      <td>{service.description}</td>
                      <td><label onClick={() => this.showEditServicePopup(i)} style={{cursor: 'pointer'}}>编辑</label><label> | </label><label onClick={() => this.deleteService(i)} style={{cursor: 'pointer'}}>删除</label></td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
            <button className="ui button" onClick={this.showAddServicePopup}>+添加服务</button>
          </div>
          </div>
          </div>
          </div>
          <div className="category">
          <div className="item first">
          <div className="content">
          <div className="inner-content">
            <div className="header">自我介绍</div>
            <textarea rows="8" name="bio" onChange={this.handleChange} value={this.state.mentor_info.bio}/>
          </div>
          </div>
          </div>
          <div className="item first">
          <div className="content">
          {!this.state.hasNotApplied ? (<button className="ui button" type="submit" onClick={this.handleSubmit}>更新</button>) :
            (<button className="ui button" type="submit" onClick={this.handleSubmit}>申请</button>)}
          </div>
          </div>
          </div>

          </form>

      </div>)
    );
  }
}

AccountApply.contextTypes = {
    router: PropTypes.object
};

export default AccountApply;
