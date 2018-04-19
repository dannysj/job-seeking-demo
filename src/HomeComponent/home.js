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
    return (
      <div>
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
        <br />
        <br />
        <Container>

          <Header textAlign={'center'} as='h3'>导师推荐</Header>
          <Link to='/mentor'><Button floated='right'>查看更多导师</Button></Link>
          <Divider hidden clearing />
          <Segment>
            <MentorList>
            </MentorList>
          </Segment>
        </Container>
        <br />
        <br />
        <Container>
          <Header textAlign={'center'} as='h3'>干货推荐</Header>
          <Link to='/news'><Button floated='right'>查看更多干货</Button></Link>
          <Divider hidden clearing />
          <Segment>
            <NewsList>
            </NewsList>
          </Segment>
        </Container>
        <br />
        <br />

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
