import React, {Component} from 'react';
import {Icon} from 'semantic-ui-react';
import {Line} from 'react-chartjs-2';
import './index.less';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {num_new_trans: 9,
             num_new_mentee: 10,
             num_new_mentor: 20,
             selections: [{"name":"today","val": "今天"},
                          {"name":"ytd", "val":"昨天"},
                          {"name":"thisweek","val": "这周"},
                          {"name":"lastweek","val": "上周"},
                          {"name":"thismonth","val": "这个月"},
                          {"name":"lastmonth","val": "上个月"},
                          {"name":"year","val": "今年"},
                          {"name":"full","val": "总"}],
             active: "today",
             data:{
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [{
              label: "新用户人数",
              borderColor: '#FF7F69',
              backgroundColor: 'rgba(0,0,0,0.0)',
              data: [0, 10, 5, 2, 20, 30, 45],
              },
              {
              label: "服务预约量",
              borderColor: '#6991FF',
              backgroundColor: 'rgba(0,0,0,0.0)',
              data: [10, 2, 7, 5, 15, 34, 25],
              },
              {
              label: "新导师人数",
              borderColor: '#FFD769',
              backgroundColor: 'rgba(0,0,0,0.0)',
              data: [8, 2, 12, 2, 3, 0, 1],
              }

            ]
          }

           };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (name) => {
    this.setState({active: name});
  };


  render() {
    const chartOptions = {
      maintainAspectRatio: false,
    };
    return (
      <div className="dashboard-main">
        <div className="d-title">
          <div className="selection">
            {
              this.state.selections.map((e) => (
                <div className="" onClick={()=> {this.handleClick(e.name)}}><div className={(this.state.active === e.name) ? "title active" : "title"}>{e.val}</div></div>
              ))
            }
            <div className="title right">
              {"Dashboard"}
            </div>
          </div>

        </div>
        <div className="d-info">
          <div className="new-mem">
            <div className="graph-icon">
              <Icon name='user' />
            </div>
            <div className="info">
              <div className="title">
              {"新用户人数"}
              </div>
              <div className="desc">
              {this.state.num_new_mentee}
              </div>
            </div>
          </div>
          <div className="new-trans">
          <div className="graph-icon">
          <Icon name='handshake' />
          </div>
          <div className="info">
            <div className="title">
            {"服务预约量"}
            </div>
            <div className="desc">
            {this.state.num_new_trans}
            </div>
          </div>
          </div>
          <div className="new-men">
          <div className="graph-icon">
            <Icon name='graduation' />
          </div>
          <div className="info">
            <div className="title">
            {"新导师人数"}
            </div>
            <div className="desc">
            {this.state.num_new_mentor}
            </div>
          </div>
          </div>
        </div>
        <div className="d-graph">
        < Line
           data={this.state.data}
           options={chartOptions}
           height={500}
           width={700}
           />
        </div>
      </div>
    )
  }
}

export default Dashboard;
