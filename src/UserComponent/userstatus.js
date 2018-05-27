import React, { Component } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import './userstatus.css';
class UserStatus extends Component {

  constructor (props) {
    super(props);

    // no such api
    // axios.post('/api/all_mentor_list',{}).then(res => {
    //   console.log(res);
    //   if(res.data.code==0){
    //     console.log(res.data.list);
    //     this.setState({mentors:res.data.list});
    //   }
    //   else{
    //     //TODO: Error Handling
    //   }
    // });
    // this.context.router.route.location.pathname
  }

  render() {
    if(this.props.user){
      return (
        <div className="right-menu">  
            <Link to="/account">
              <div className="user-inline">
                <div className="chinese-top">我的账号</div>
                <img className="ui mini circular image" src={this.props.user.profile_pic}/>
              </div>
            </Link>
        </div>
      );
    }
    return (
      <div className="right menu">
        <div className="large-screen">
        <div className="item">
          <Link className="item" to="/login">
              登陆
          </Link>
        </div>
        <div className="item">
          <Link className="item" to="/signup">
              注册
          </Link>
        </div>
        </div>
        <div className="small-screen">
          <div className="item">
            <Link to="/login">
              <Icon name='user circle' color="blue" size='big' />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default UserStatus;
