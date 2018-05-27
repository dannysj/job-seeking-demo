import React, {Component} from 'react';
import './CommentBox.css';

class CommentBox extends  Component{
  constructor (props) {
    super(props);
    this.state={data:[]};
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }

  handleCommentSubmit(comment) {
    this.props.data.push(comment);
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
  }

  render() {
    return (
      <div className="comment-box">
        <CommentForm data={this.props.data} onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.props.data} />
      </div>
    );
  }
}
class CommentList extends Component{
  render() {
    return (
      <div className="comment-list">
        {this.props.data.map(function(c){
          return (
            <Comment author={c.author} text={c.text} />
          );
        })}
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

    var authorVal = e.target[0].value.trim();
    var textVal = e.target[1].value.trim();
    if (!textVal || !authorVal) {
      return;
    }
    this.props.onCommentSubmit({author: authorVal, text: textVal});
    e.target[0].value = '';
    e.target[1].value = '';
  }

  render() {
    return(
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <div>
          <span className="ui text">Name</span>
          <input type="text" placeholder="Your name" className="ui text" />
        </div>
        <div>
          <span className="ui text">Comment</span>
          <input type="text" placeholder="Say something..." className="ui text" />
        </div>

        <input type="submit" value="Post" className="ui button" />
      </form>
    );
  }
}

class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <h2 className="author">{this.props.author}</h2>
        <p className="comment-content">{this.props.text}</p>
      </div>
    );
  }
}

export default CommentBox;