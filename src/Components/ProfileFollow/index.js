import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import './index.less';
import axios from 'axios';
import store from "../../redux/index";

const FollowStatus = {
  UNKNOWN : 0,
  FOLLOWED : 1,
  UNFOLLOWED : 2
}

class ProfileFollow extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: this.props.user,
      loggedInUser: this.props.loggedInUser,
      author_id: this.props.author_id,
      followStatus: FollowStatus.UNKNOWN,
    };

    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.followButtonPressed = this.followButtonPressed.bind(this);
  }

  followButtonPressed() {
    console.log("Test");
    // User id, props.loggedInUser.uid
    // The other one. this.state.news.author_id
    // call the function 

    // TODO: Change the acceptable environment in the backend.
    if (store.getState().user){
      axios.post('/api/follow_user',
       {followee_uid: this.state.author_id},
       {headers: {"access_token": store.getState().user.access_token}}
      ).then(res=>{
          if (res.data.code === 0){
            this.setState({followStatus: FollowStatus.FOLLOWED})
            console.log("follow")
          }else{
            console.log("error")
          }
      })
    }
  }

  renderFollowButton(){
      switch (this.state.followStatus) {
        case FollowStatus.UNFOLLOWED:
          return (<Button
            size='mini'
            color='blue'
            content='关注'
            icon='plus'
            onClick={this.followButtonPressed}
          />) 
        
        case FollowStatus.FOLLOWED:
          return (<Button
            size='mini'
            color='grey'
            content='已关注'
          />)
        case FollowStatus.UNKNOWN:
          return (<div/>)

        default:
          return (<div/>);
      }
  }

  render() {
    if (store.getState().user && this.state.followStatus === FollowStatus.UNKNOWN){
      axios.post('/api/whether_followed',
      {followee_uid: this.state.author_id}, {headers: {"access_token": store.getState().user.access_token}}).then(res=>{
            if (res.data.whetherFollowed === true){
              this.setState({followStatus: FollowStatus.FOLLOWED })  
            }else{
              this.setState({followStatus: FollowStatus.UNFOLLOWED})
            }
       })
     }

    return (
      <div className="follow-container">
        <img src={this.state.user.profile_pic} alt="Profile"/>
        <div className="follow-text-container">
          <div className="follow-title">
            <div className="follow-name">
              {this.state.user.last + this.state.user.first}
            </div>
           {this.renderFollowButton()}
          </div>
          <div className="follow-subtitle">
            {this.state.user.cover?
              this.state.user.cover:'该作者并未留下自我介绍'}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileFollow;
