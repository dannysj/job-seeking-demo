import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { Header, Container, Segment, Button, Divider } from 'semantic-ui-react';
import NewsList from './news_list';
import MentorList from './mentor_list';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import './home.css';


class Home extends Component {

  render() {
    var test_url = '/files/test.jpg';
    const backimgstyle = {
      backgroundImage: 'url('+test_url+')',
      backgroundPosition: 'center center no-repeat',
      backgroundSize: 'cover',
      };
    return (
      <div>
        <div className="header-cover" style={backimgstyle}>
          <Container>
            <div className="container-sideline">
            <div className="header-text">
              <div className="container-block">
                <div className="chinese-top">求 职 路 上&nbsp;&nbsp;&nbsp;&nbsp;<strong>你</strong> 并 不 孤 单</div>
                <div className="subtitle">Share Connect Succeed</div>
              </div>
            </div>
            </div>
          </Container>
        </div>
        <br />
        <br />
        <Container>
          <div className="container-sideline">
          <div className="header-text">
          <div className="container-block">
            <div className="chinese-top">导 师 推 荐 </div>
            <div className="subtitle">Hot Tutors</div>
          </div>
          </div>
          <Divider hidden clearing />
          <div>
            <MentorList>
            </MentorList>
          </div>
          <Link to='/mentor'>
            <div style={{textAlign:'right'}}>
              <div className="">More</div>
              <div className="chinese-top">更多</div>
            </div>

          </Link>
          </div>
        </Container>
        <br />
        <br />
        <Container>
          <div className="container-sideline">
              <div className="header-text">
              <div className="container-block">
                <div className="chinese-top">干 货 推 荐</div>
                <div className="subtitle">Hot Careers</div>
              </div>
              </div>
            <Divider hidden clearing />
            <div>
              <NewsList>
              </NewsList>
            </div>
            <Link to='/news'>
            <div style={{textAlign:'right'}}>
              <div className="">More</div>
              <div className="chinese-top">更多</div>
            </div>
            </Link>
          </div>
        </Container>
        <br />
        <br />

        <footer className="main-footer">
          <Container>
            <div className="footer-container">
            <p className="chinese-top">伙伴求职 Buddy Career</p>
            <p>www.buddycareer.com</p>
            <p>© 2018 Buddy Career | All Fucking Rights Reserved</p>
            <p><Link to="about">About</Link> | <Link to="contact">Contact</Link></p>
            </div>
          </Container>
        </footer>
      </div>
    );
  }
}

export default Home;

/* Code for Carousel
<Carousel showThumbs={false} autoPlay={true} interval={3000} showStatus={false}>
  <div>
    <img width={900} height={500} alt="900x500" src="/img/banner1.jpg" />
  </div>
  <div>
    <img width={900} height={500} alt="900x500" src="/img/test1.jpg" />
  </div>
  <div>
    <img width={900} height={500} alt="900x500" src="/img/test3.jpg" />
  </div>
</Carousel>
*/
