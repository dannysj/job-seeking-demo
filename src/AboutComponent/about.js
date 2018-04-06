import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';
import axios from 'axios';
import './about.css';
import '../NewsComponent/news.css';

class About extends React.Component {
  render() {
    return(
      <div>
        <Container text>
          
        </Container>
      </div>
    );
  }
}

About.contextTypes = {
    router: PropTypes.object
};

export default About;
