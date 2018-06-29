import React, {Component} from 'react';
import { Icon, Button } from 'semantic-ui-react';
import './CommentBox.css';
import store from '../redux'
import {createMentorComment, createMentorReply, fetchMentorDetail} from "../redux/mentorDetailAction";

class CommentBox extends Component{
  render() {
    return (
      <div className="comment-box">
        {!this.props.hideComment &&
        ((this.props.mentor.comments === null ) ? (
          <div style={{display: 'flex', justifyContent: 'center', lineHeight: '200%'}}>暂无评价</div>
        ) : ( (this.props.mentor.comments.length === 0) ? (<div style={{display: 'flex', justifyContent: 'center', lineHeight: '200%'}}>暂无评价</div>)
          : (<div className="comment-list">
          {this.props.mentor.comments.map(comment => (
            <Comment comment={comment}
                     onCommentReply={this.handleCommentReply}
                     mentor={this.props.mentor}
                     displayCommentReplyButton={this.props.displayCommentReplyButton}/>
          ))}
        </div>)

        ))}
        {this.props.user && this.props.user.id && <CommentForm mentor={this.props.mentor}/>}
      </div>
    );
  }
}


class CommentForm extends Component{
  handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target[0].value.trim();
    if (!text) {
      return;
    }

    store.dispatch(createMentorComment(this.props.mentor.mid, text)).then(()=>{
      store.dispatch(fetchMentorDetail(this.props.mentor.mid))
    });


    e.target[0].value = '';
  }

  render() {
    return(
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <textarea rows="1" className="comment-input" placeholder="说点什么吧......" />
        <Button type="submit" circular color='teal' icon>
          <Icon circular inverted color='teal' name='send' forName="submit-button" size='large'/>
        </Button>
      </form>
    );
  }
}


class Comment extends Component {
  constructor (props) {
    super(props);
    this.state={displayCommentReply:false};
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const reply = e.target[0].value.trim();
    if (!reply) {
      return;
    }

    store.dispatch(createMentorReply(this.props.comment.id, reply)).then(()=>{
      store.dispatch(fetchMentorDetail(this.props.mentor.mid))
    });

    e.target[0].value = '';
    this.handleDisplayCommentReply();
  }

  handleDisplayCommentReply = () =>{
    this.setState({displayCommentReply:!this.state.displayCommentReply});
  }

  render() {
    return (
      <div className="comment">
        <div className="comment-top">
          <div className="left">
            <img className="comment-img" src={this.props.comment.profile_pic} alt=""/>
          </div>
          <div className="right">
            <div className="comment-author">{this.props.comment.last + this.props.comment.first}
            <label></label>
            </div>
            <div className="comment-time">{this.props.comment.time_added}</div>
            <div className="comment-content">{this.props.comment.text}</div>
          </div>
        </div>
        <div className="comment-bottom">
        {this.props.comment.reply ? (
          <div className="comment-reply comment-content">
              <div style={{fontWeight: 'Bold', height: '50px', width: '50px', marginRight:'1em'}}><img className="mentor-reply-img" src={this.props.mentor.profile_pic} alt=""/> </div>
              <div style={{borderRadius: '5px',padding: '0.5em', lineHeight: '1.5', height: 'auto', flex: '1 0', textAlign: 'left', background: 'rgba(34, 36, 38, 0.08)'}}>{this.props.comment.reply}</div>
            </div>
          ):(
            this.props.displayCommentReplyButton &&
              <div className="comment-reply-overview">
                <div className="comment-reply-section">
                <div className="like-section">
                  <div className="like-comment"><Icon color={this.props.comment.like ? 'red' : 'black' } name={this.props.comment.like ? 'heart' : 'heart outline'} /></div>
                  <div className="like-count">9</div>

                </div>
                <div onClick={this.handleDisplayCommentReply} className="reply-right"><Icon className="reply-logo" color='blue' name='reply' />回复</div>
                </div>
                {this.state.displayCommentReply &&
                  <form className="reply-form" onSubmit={this.handleSubmit}>
                    <textarea className="reply-input" placeholder="回复此评论"/>
                    <Button type="submit" circular color='teal' icon>
                      <Icon circular inverted color='teal' name='send' forName="submit-button" size='large'/>
                    </Button>

                  </form>
                }
              </div>
        )}
        </div>

      </div>
    );
  }
}

export default CommentBox;
