import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';
import axios from 'axios';
import './about.css';
import '../NewsComponent/news.css';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      share: [
        {
          name:"申请经验",
          description: "分享一下申请 Google暑期实习的经历吧"
        },
        {
          name:"心路历程",
          description: "你是如何从一开始的迷茫一步步走到今天 的高度的?"
        },
        {
          name:"实习经历",
          description: "在Deloitte的工作是一种怎么样的体验?"
        },
        {
          name:"行业介绍",
          description: "你所在的制药 行业是怎么样的主要是做什么样的工作呢?"
        },
      ]
    }
  }
  render() {
    let abt1 = '/img/about1.jpg';
    let abt2 = '/img/about2.jpg';
    let abt3 = '/img/about3.jpg';
    const backimgstyle1 = {
      backgroundImage: 'url('+abt1+')',

      };
    const backimgstyle2 = {
      backgroundImage: 'url('+abt2+')',

      };
    const backimgstyle3 = {
      backgroundImage: 'url('+abt3+')',

      };
    return(
      <div className="about-container">
        <div className="parallax dark" style={backimgstyle1}>
          <div className="cali-group">
            <div className="cali-title vertical-text ">
              同行
            </div>
          </div>
          <div className="about-sub">
            是一个在线的平台，在这里，像你一样的求职过来人，
            更有经验的学长学姐可以入驻成为Mentor，无偿或有偿地分享自己求职和实习方面的经验，
            帮助更多后来人取得求职上的成功。
          </div>
        </div>
        <div className="about-divide">
        </div>
        <div className="parallax light hori" style={backimgstyle2}>
          <div className="cali-group">
            <div className="cali-title small">
              我们的
            </div>
            <div className="cali-title vertical-text ">
              目标
            </div>
          </div>
          <div className="about-sub">
            通过留学生群体之间的互相帮助，
            让更多的中国留学生在求职中无需依赖价格高昂的求职中介，
            依旧能得到丰富的行业信息和经验分享。
          </div>
        </div>
        <div className="about-divide">
        </div>
        <div className="parallax dark" style={backimgstyle3}>
          <div className="cali-group">
            <div className="cali-title small">
              我们是
            </div>
            <div className="cali-title vertical-text ">
              谁
            </div>
          </div>
          <div className="about-sub">
            我们是一群北美留学生，经历过求职季的艰辛和没有过来人指导的迷茫。
            我们希望通过搭建一个留学生之间的求职互助平台，为留学生求职打开另一扇门。
          </div>
        </div>
        <div className="about-divide">
        </div>
        <div className="parallax light" style={backimgstyle1}>
          <div className="cali-group hori">
            <div className="cali-title small">
              成为一个Mentor
            </div>
          </div>
          <div className="cali-title medium">
            你将会分享什么
          </div>
          <div className="share-container">
            {
              this.state.share.map((e) => {
                return (
                  <div className="share-box">
                    <div className="title">
                    {e.name}
                    </div>
                    <div className="description">
                    {e.description}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

About.contextTypes = {
    router: PropTypes.object
};

export default About;
