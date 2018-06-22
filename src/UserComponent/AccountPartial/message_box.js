import React from 'react';
import PropTypes from 'prop-types';
import { Message, Image} from 'semantic-ui-react'

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
