import React, {Component} from 'react';
import './CommentBox.css';
import axios from "axios/index";

class CommentBox extends Component{
  constructor (props) {
    super(props);
    this.state={comments:[]};
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentReply = this.handleCommentReply.bind(this);

    axios.post('/api/get_mentor_comment', {mid: this.props.mid}).then(res => {
      if (res.data.code === 0) {
        this.setState({comments: res.data.list});
      } else {
        //TODO: Error Handling
      }
    });
  }

  handleCommentSubmit(comment) {
    this.setState({comments: [...this.state.comments, comment]});

    comment.mid = this.props.mid;
    axios.post('/api/create_mentor_comment', comment).then(res => {
      // TODO: Error Handling
    });
  }

  handleCommentReply(comment){
    console.log(comment);
    this.setState({comments: [...this.state.comments, comment]});

    comment.mid = this.props.mid;
    axios.post('/api/create_mentor_reply', comment).then(res => {
      // TODO: Error Handling
    });
  }

  render() {
    return (
      <div className="comment-box">
        {!this.props.hideComment &&
          (this.state.comments.length === 0 ?
            <div>暂无评价</div> :
            <CommentList comments={this.state.comments} onCommentReply={this.handleCommentReply} user={this.props.user}/>)
        }
        {this.props.user ? <CommentForm onCommentSubmit={this.handleCommentSubmit} user={this.props.user}/> : <div/>}
      </div>
    );
  }
}


class CommentList extends Component{
  render() {
    return (
      <div className="comment-list">
        {this.props.comments.map(comment => (<Comment comment={comment} onCommentReply={this.props.onCommentReply} user={this.props.user}/>))}
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
      uid:  this.props.user.id,
      id: this.props.comment.id
    });

    e.target[0].value = '';
  }

  render() {
    return(
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <textarea rows="8" className="comment-input" placeholder="说点什么吧......" />
        <input className="comment-submit ui button" type="submit" value="提交" />
      </form>
    );
  }
}


class Comment extends Component {
  constructor (props) {
    super(props);
    this.state={displayCommentReply:false};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDisplayCommentReply = this.handleDisplayCommentReply.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const reply = e.target[0].value.trim();
    if (!reply) {
      return;
    }

    this.props.onCommentReply({
      text: this.props.comment.text,
      first: this.props.user.first,
      last: this.props.user.last,
      time_added: new Date().toGMTString(),
      profile_pic: this.props.user.profile_pic,
      uid:  this.props.user.id,
      id: this.props.comment.id,
      reply: reply
    });

    console.log(reply);

    e.target[0].value = '';
  }

  handleDisplayCommentReply(){
    this.setState({displayCommentReply:!this.state.displayCommentReply});
  }

  render() {
    return (
      <div className="comment">
        <img className="comment-img" src={this.props.comment.profile_pic}/>
        <div className="comment-author">{this.props.comment.first + this.props.comment.last}</div>
        <div className="comment-time">{new Date(this.props.comment.time_added).toLocaleString()}</div>
        <div className="comment-content">{this.props.comment.text}</div>

        {this.props.comment.reply ? <div className="comment-reply">{this.props.comment.reply}</div> :
          <div onClick={this.handleDisplayCommentReply}>回复</div>}
        {this.state.displayCommentReply ? (
          <form className="reply-form" onSubmit={this.handleSubmit}>
            <textarea rows="8" className="reply-input" placeholder="回复此评论"/>
            <input className="reply-submit ui button" type="submit" value="提交"/>
          </form>) : <div/>}
      </div>
    );
  }
}

export default CommentBox;