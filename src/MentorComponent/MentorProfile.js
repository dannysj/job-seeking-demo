import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class MentorProfile extends Component {


  // // Follow action might not needed now.
  // follow_action = (uid, mentor_uid) => {
  //   axios.post('/api/create_follower_followee_relationship', {follower_uid:uid , followee_uid: mentor_uid} )
  //        .then(res=> ())
  //        .catch(err => console.log(err))
  //   console.log("Button click")
  //   let followees = this.state.followees;
  //   followees.push(mentor_uid);
  //   this.setState({followees: followees})
  // }
  //
  // unfollow_action = (uid, mentor_uid) => {
  //   let followees = this.state.followees;
  //   let index = followees.indexOf(mentor_uid)
  //   if (index > -1){
  //     followees.splice(index, 1);
  //   }
  //   this.setState({followees: followees})
  //
  // }
  //
  // renderFollowButton = (mentor_uid) => {
  //   let followee_list = this.state.followees;
  //   if (followee_list.includes(mentor_uid)){
  //     return (
  //       // Need add onclick to delete the mentor_uid to table and reset state
  //       // onclick = {create}
  //
  //       <button class="ui active button" onClick={()=>this.unfollow_action(0, mentor_uid)} >
  //         <i class="user icon"></i>
  //         Unfollow
  //       </button>
  //     )
  //   }
  //   else {
  //     // Need add onclick to add the mentor_uid to table and reset state
  //     return (
  //       <button class="ui active button" onClick={()=>this.follow_action(0, mentor_uid)}>
  //         <i class="user icon"></i>
  //         Follow
  //       </button>
  //     )
  //   }
  // }

  renderRow = (icon, text) =>
    (<Table.Row className="table-clean-row">
      <Table.Cell><img className="title-icon" alt="position" src={icon}/></Table.Cell>
      <Table.Cell><div className="card-info">{text}</div></Table.Cell>
    </Table.Row>);

  render() {
    const mentor = this.props.mentor;

    return (
      <div className="mentor-container" key={mentor.id}>
        <div className="inner-container">
          <div className="mentor-profile">
            <img className="mentor-picture" src={mentor.profile_pic} alt={mentor.last + ' ' + mentor.first}/>
            <br/>
            <div><strong>{mentor.last + ' ' + mentor.first}</strong></div>
          </div>
          <div className="vertical-divider"/>
          <div className="mentor-text">
            <Table className="table-clean-border" basic='very'>
              <Table.Body>
                {this.renderRow('/icons/company.png', mentor.offer_company)}
                {this.renderRow('/icons/school.png', mentor.offer_title)}
                {this.renderRow('/icons/position.png', mentor.college_name)}
                {this.renderRow('/icons/age.png', mentor.major.join(', '))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <Link to={'/mentor/' + mentor.mid}>
          <div className="connect-circle">
            <div>详情</div>
          </div>
        </Link>

      </div>
    )
  }
}

export default MentorProfile;