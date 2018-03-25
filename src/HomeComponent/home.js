import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header, Container, Segment } from 'semantic-ui-react'
import './home.css';

class Home extends Component {
  render() {
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src="/img/test1.jpg" />
            <Carousel.Caption>
              <h3>求职路上</h3>
              <p>你我同行</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src="/img/test2.jpg" />
            <Carousel.Caption>
              <h3>定位准确</h3>
              <p>Buddy Career为您提供最准确的求职定位</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src="/img/test3.jpg" />
            <Carousel.Caption>
              <h3>价格合理</h3>
              <p>最低的价格，最合适的导师</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Container>
          <Header as='h2'>导师推荐</Header>
        </Container>
        <footer className="main-footer">
          <p>伙伴求职 Buddy Career</p>
          <p>www.buddycareer.com</p>
          <p>© 2018 Buddy Career | All Fucking Rights Reserved</p>
          <p><Link to="about">About</Link> | <Link to="contact">Contact</Link></p>
        </footer>
      </div>
    );
  }
}

export default Home;
