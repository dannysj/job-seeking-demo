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
  renderRow = (name, text) =>
    (<div className="item">
        <div className="logo-item">{name}</div>
        <div className="card-info">{text}</div>
      </div>
    );

  render() {
    const mentor = this.props.mentor;
    const isFollowing = this.props.followee.includes(mentor.uid);
    //FIXME:
    const isAvailable = true;
    const backimgstyle = {
      backgroundImage: 'url('+mentor.profile_pic+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      filter:'blur(1em)',
      };
    return (
      <div className="mentor-container" key={mentor.mid}>
        <div className="inner-container">
          <div className="mentor-profile">
            <div className="mentor-profile-background" style={backimgstyle}> </div>
            <div className="">
            <img className="mentor-picture" src={mentor.profile_pic} alt={mentor.last + ' ' + mentor.first}/>
            <br/><br/>
            <div><strong>{mentor.last + ' ' + mentor.first}</strong></div>
            </div>
            <div className="mentor-buttons-container">
            {
              (this.props.user) ? (      <div className={`mentor-button ${isFollowing ? 'following' : 'not-following'}-button`}>
                      <div onClick={() => isFollowing ? this.props.unfollowUser(mentor.uid) : this.props.followUser(mentor.uid)}/>
                    </div>) : (<div></div>)
            }

            <div className={`mentor-button ${isAvailable ? 'available' : 'not-available'}-button`}>
              <div></div>
            </div>
            </div>
          </div>

          <div className="mentor-text">
            <div className="mentor-text-inner">
                {this.renderRow('在读院校', mentor.college_name)}
                {this.renderRow('offer公司', mentor.offer_company)}
                {this.renderRow('专业', mentor.major.join(', '))}
                {this.renderRow('offer职位', mentor.offer_title)}




            </div>
          </div>
        </div>

        <div className="connect-circle-container">
          <Link to={'/mentor/' + mentor.mid}>
            <div className="connect-circle">
              <div>详情</div>
            </div>
          </Link>
        </div>

      </div>
    )
  }
}

export default MentorProfile;
