import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import './index.less';
import axios from 'axios';

class ProfileFollow extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: this.props.user,
      loggedInUser: this.props.loggedInUser,
      author_id: this.props.author_id,
      followed: false
    };

    /*
    if (this.props.loggedInUser != undefined){
      axios.post('/api/whether_followed',
      {follower_uid: this.props.loggedInUser.id , followee_uid: this.state.author_id}).then(res=>{
            this.setState({followed: res.data.whetherFollowed })
       })
     }*/

    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.followButtonPressed = this.followButtonPressed.bind(this);
  }

  followButtonPressed() {
    console.log("Test");
    // User id, props.loggedInUser.uid
    // The other one. this.state.news.author_id
    // call the function 

    if (this.props.loggedInUser !== undefined){
      axios.post('/api/follow_user',
       {follower_uid: this.props.loggedInUser.id , followee_uid: this.state.author_id}).then(res=>{
          console.log("follow")    
      })
    }
  }

  renderFollowButton(){
      /*if (!this.state.followed){
         return (<Button
          size='mini'
          color='blue'
          content='关注'
          icon='plus'
          onClick={this.followButtonPressed}
        />) 
      }else{
        return (<Button
          size='mini'
          color='grey'
          content='已关注'
        />
        )
      }*/
      return (<Button
        size='mini'
        color='blue'
        content='关注'
        icon='plus'
        onClick={this.followButtonPressed}
      />)

  }

  render() {
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
