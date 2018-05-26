import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './index.css';

class Footer extends Component {

  render() {
    return (
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
    );
  }
}

export default Footer;