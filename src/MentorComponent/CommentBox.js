import React, {Component} from 'react';
import './CommentBox.css';
import axios from "axios/index";
import dateformat from "dateformat";

class CommentBox extends Component{
  constructor (props) {
    super(props);
    this.state={comments:[]};
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentReply = this.handleCommentReply.bind(this);

    axios.post(process.env.REACT_APP_API_HOST + '/api/get_mentor_comment', {mid: this.props.mid}).then(res => {
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
    axios.post(process.env.REACT_APP_API_HOST + '/api/create_mentor_comment', comment).then(res => {
      // TODO: Error Handling
    });
  }

  handleCommentReply(comment){
    let comments = this.state.comments;
    comments[comments.findIndex(item => item.id === comment.id)].reply = comment.reply;

    this.setState({comments: comments});

    axios.post(process.env.REACT_APP_API_HOST + '/api/create_mentor_reply', comment).then(res => {
      // TODO: Error Handling
    });
  }

  render() {
    return (
      <div className="comment-box">
        {!this.props.hideComment &&
        (this.state.comments.length === 0 ? (
          <div style={{display: 'flex', justifyContent: 'center', lineHeight: '200%'}}>暂无评价</div>
        ) : (
          <div className="comment-list">
            {this.state.comments.map(comment => (
              <Comment comment={comment}
                       onCommentReply={this.handleCommentReply}
                       displayCommentReplyButton={this.props.displayCommentReplyButton}/>
            ))}
          </div>
        ))}

        {this.props.user && this.props.user.id && <CommentForm onCommentSubmit={this.handleCommentSubmit} user={this.props.user}/>}
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
      time_added: dateformat(new Date(),"DD Mon HH24:MI"),
      profile_pic: this.props.user.profile_pic,
      uid:  this.props.user.id
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
      id: this.props.comment.id,
      reply: reply
    });

    e.target[0].value = '';
    this.handleDisplayCommentReply();

  }

  handleDisplayCommentReply(){
    this.setState({displayCommentReply:!this.state.displayCommentReply});
  }

  render() {
    return (
      <div className="comment">
        <img className="comment-img" src={this.props.comment.profile_pic}/>
        <div className="comment-author">{this.props.comment.last + this.props.comment.first}</div>
        <div className="comment-time">{this.props.comment.time_added}</div>
        <div className="comment-content">{this.props.comment.text}</div>

        {this.props.comment.reply ? (
          <div className="comment-reply comment-content">
              <span style={{fontWeight: 'Bold'}}>Mentor回复: </span>
              {this.props.comment.reply}
            </div>
          ):(
            this.props.displayCommentReplyButton &&
              <div>
                <div onClick={this.handleDisplayCommentReply}>回复</div>
                {this.state.displayCommentReply &&
                  <form className="reply-form" onSubmit={this.handleSubmit}>
                    <textarea rows="8" className="reply-input" placeholder="回复此评论"/>
                    <input className="reply-submit ui button" type="submit" value="提交"/>
                  </form>
                }
              </div>
        )}
      </div>
    );
  }
}

export default CommentBox;