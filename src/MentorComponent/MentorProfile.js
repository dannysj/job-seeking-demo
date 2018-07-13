import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {followUser, unfollowUser} from '../redux/userAction'
import './MentorProfile.less'

@connect(state => ({
  followee: (state.user && state.user.followee) ? state.user.followee : [],
}), {
  followUser: followUser,
  unfollowUser: unfollowUser
})
class MentorProfile extends Component {
  renderRow = (icon, text) =>
    (<Table.Row className="table-clean-row">
      <Table.Cell><img className="title-icon" alt="position" src={icon}/></Table.Cell>
      <Table.Cell>
        <div className="card-info">{text}</div>
      </Table.Cell>
    </Table.Row>);

  render() {
    const mentor = this.props.mentor;
    const isFollowing = this.props.followee.includes(mentor.uid);

    return (
      <div className="mentor-container" key={mentor.mid}>
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
                {this.renderRow('/icons/school.png', mentor.college_name)}
                {this.renderRow('/icons/position.png', mentor.offer_title)}
                {this.renderRow('/icons/age.png', mentor.major.join(', '))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <div className="connect-circle-container">
          <Link to={'/mentor/' + mentor.mid}>
            <div className="connect-circle">
              <div>详情</div>
            </div>
          </Link>
          <div className={`connect-circle ${isFollowing ? 'following' : 'not-following'}-button`}>
            <div onClick={() => isFollowing ? this.props.unfollowUser(mentor.uid) : this.props.followUser(mentor.uid)}/>
          </div>
        </div>

      </div>
    )
  }
}

export default MentorProfile;