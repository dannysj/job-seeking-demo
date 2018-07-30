import React, {Component} from 'react';
import {Image, Pagination, Segment} from "semantic-ui-react";
import './notification.less'

export default class NotificationContainer extends Component {
  itemsPerPage = 10;
  state = {
    page: 1,
    totalPages: 1
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.messages.length !== this.props.messages.length)
      this.setState({
        totalPages: Math.ceil(this.props.messages.length / this.itemsPerPage)
      })
  }

  handlePageChange = (e, {activePage}) => this.setState({page: activePage});

  render() {
    const start = (this.state.page - 1) * this.itemsPerPage;
    const end = this.state.page * this.itemsPerPage;
    const messages = this.props.messages.slice(start, end);

    return (
      <div className="category last notification">
        {messages.map(el => (
          <div className="item">
            <Segment>
              <Image avatar src='/img/icon.png'/>
              系统通知：<div className='timestamp'>{new Date(el.timestamp).toLocaleString()}</div>
              <br/>
              <div className="bio-display">
                {el.content}
              </div>
            </Segment>
          </div>
        ))}
        <br/>
        {this.state.totalPages > 1 &&
        <Pagination activePage={this.state.page}
                    totalPages={this.state.totalPages}
                    onPageChange={this.handlePageChange}
                    className="page-bottom"/>}
      </div>
    )
  }
}

