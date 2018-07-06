import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class MentorProfile extends Component {

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