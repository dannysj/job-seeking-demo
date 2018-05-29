import React, {Component} from 'react';
import './CommentBox.css';

class CommentBox extends Component{
  constructor (props) {
    super(props);
    this.state={comments:[]};
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }

  handleCommentSubmit(comment) {
    this.props.comments.push(comment);
    this.props.onCommentSubmit(comment);
    this.setState({comments: [...this.state.comments, comment]});
  }

  render() {
    return (
      <div className="comment-box">
        {this.props.user?<CommentForm onCommentSubmit={this.handleCommentSubmit} user={this.props.user} />:<div/>}
        {this.props.comments.length === 0? <div>暂无评价</div> : <CommentList comments={this.props.comments} />}
      </div>
    );
  }
}


class CommentList extends Component{
  render() {
    return (
      <div className="comment-list">
        {this.props.comments.map(comment => (<Comment comment={comment}/>))}
      </div>
    );
  }
}


class CommentForm extends Component{
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const text = e.target[0].value.trim();
    if (!text) {
      return;
    }
    this.props.onCommentSubmit({
      text: text,
      first: this.props.user.first,
      last: this.props.user.last,
      time_added: new Date().toGMTString(),
      profile_pic: this.props.user.profile_pic,
      uid:  this.props.user.uid
    });

    e.target[0].value = '';
  }

  render() {
    return(
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <img className="form-author-img" src={this.props.user.profile_pic}/>
        <input className="form-comment-input" type="text" placeholder="说点什么吧......" />
        <input type="submit" value="提交" className="ui button" />
      </form>
    );
  }
}


class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <img className="comment-img" src={this.props.comment.profile_pic}/>
        <div className="comment-author">{this.props.comment.first + this.props.comment.last}</div>
        <div className="comment-content">{this.props.comment.text}</div>
        <div className="comment-time">{this.props.comment.time_added}</div>
      </div>
    );
  }
}

export default CommentBox;