import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Message, Image, Input } from 'semantic-ui-react'
import CommentBox from "../../MentorComponent/CommentBox";
import NavLink from '../../NavLinkComponent/navlink';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
//this.props.match.params.nid
  }


  render() {
    return(
      <div>
        <Image src='/img/icon.png' avatar />
        <Message compact>
          测试消息
        </Message>{new Date().toLocaleTimeString()}
        <br />
        <Image src='/img/icon.png' avatar />
        <Message compact>
          测试消息
        </Message>{new Date().toLocaleTimeString()}
        <br />
        <Image src='/img/icon.png' avatar />
        <Message compact>
          测试消息
        </Message>{new Date().toLocaleTimeString()}
        <br />
        <Image src='/img/icon.png' avatar />
        <Message compact>
          测试消息
        </Message>{new Date().toLocaleTimeString()}
      </div>
    );
  }
}

MessageBox.contextTypes = {
    router: PropTypes.object
};

export default MessageBox;
