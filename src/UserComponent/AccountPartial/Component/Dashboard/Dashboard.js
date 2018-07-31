import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {Line} from 'react-chartjs-2';
import './Dashboard.less';

class Dashboard extends Component {
  constructor(props) {
    state = {num_new_trans: 9,
             num_new_mentee: 10,
             num_new_mentor: 20,
             selections: [{"today": "今天"},{"ytd": "昨天"},{"thisweek":"这周"},{"lastweek":"上周"},{"thismonth":"这个月"},{"lastmonth":"上个月"},{"year":"今年"},{"full":"总"}],
             active: "today",
             data= {
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [{
              label: "My First dataset",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [0, 10, 5, 2, 20, 30, 45],
              }]
          }

           };
  }

  render() {

    return (
      <div className="dashboard-main">
        <div className="d-title">
          <div className="selection">
            {
              this.state.selections.map(([key,value]) => (
                <div className={(this.state.active === key) ? "title active" : "title"} value={key}>{value}</div>
              ))
            }
          </div>
          <div className="title">
            {"Dashboard"}
          </div>
        </div>
        <div className="d-info">
          <div className="new-mem">
            <div className=""></div>
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
          <div className=""></div>
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
          <div className=""></div>
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
           data={this.state.chartData}
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
