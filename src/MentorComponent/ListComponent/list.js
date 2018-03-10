import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import axios from 'axios';
import './list.css';

class List extends Component {

  constructor (props) {
    super(props);

    this.state={mentors:[]};
    axios.post('http://localhost:3005/api/get_mentor_list',{}).then(res => {
      console.log('FUCK!!');
      console.log(res);
      if(res.data.code==0){
        console.log(res.data.list);
        this.setState({mentors:res.data.list});
      }
      else{
        //TODO: Error Handling
      }
    });
    // this.context.router.route.location.pathname
  }

  render() {
    return (
      <div>
        {this.state.mentors.map(el => (
          <div className="mentor-container" key={el.id}>
            <img className="mentor-picture" src={el.profile_pic}></img>
            <div className="mentor-text">
              <h4>{el.last+' '}{el.first}</h4>
              <p>Offer: {el.offer}</p>
              <p>院校: {el.college}</p>
              <p>专业: {el.major}</p>
              <p>最低价格: {el.lowest_price}</p>
            </div>
            <Button floated='right'>点击查看细节>></Button>
          </div>
        ))}
      </div>
    );
  }
}

export default List;
