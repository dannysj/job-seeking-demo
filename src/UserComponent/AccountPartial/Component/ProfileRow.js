import React from "react";
import store from "../../../redux";
import {updateUser} from "../../../redux/userAction";
import {TextArea} from "semantic-ui-react";

export default class ProfileRow extends React.Component{
  constructor(props){
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return ({
      editing: false,
      attrs: this.props.keys.map((e, i) => ({
        key: e, // 'first'
        value: this.props.user[e], // 'Shawn'
        name: this.props.names[i] // '名'
      }))
    });
  };

  renderAttrDisplay = () => this.props.display ? this.props.display :this.state.attrs.map(e => (
    <div className="inner-content">
      <div className="header">{e.name}</div>
      <div className="info">{e.value ? ((e.value instanceof Array) ? e.value.join(', ') : e.value) : '暂无资料'}</div>
    </div>
  ));

  renderAttrEditor = () => {
    const {children} = this.props;
    const {attrs} = this.state;
    if (children) {
      const onChange = this.handleInputChange;
      const value = this.state.attrs[0].value;
      return React.Children.map(children, child => React.cloneElement(child, {onChange, value}));
    } else if (this.props.multiline) {
      return attrs.map((e, i) => <TextArea rows="8" name={e.key} id={i} value={e.value} onChange={this.handleInputChange}/>)
    } else {
      return attrs.map((e, i) => <input type="text" name={e.key} id={i} value={e.value} onChange={this.handleInputChange}/>)
    }
  };

  initAttrChange = () => {
    this.setState({editing: true});
  };

  handleInputChange = (e, data) => {
    let attrs = this.state.attrs;
    const index = data ? 0 : e.target.id;
    const value = data ? data.value : e.target.value;
    attrs[index].value = value;
    this.setState({attrs});
  };

  confirmAttrChange = () => {
    this.state.attrs.forEach(e => {
      store.dispatch(updateUser(e.key, e.value));
    });
    this.setState({editing: false});
  };

  cancelAttrChange = () => {
    this.setState(this.getInitialState());
  };

  render(){
    const editing = this.state.editing;
    return (
      <div className={"item " + (editing ? "is-expanded" : "")}>
        <div className="content">
          {this.renderAttrDisplay()}
          <div className="edit-toggle" onClick={this.initAttrChange}>
            编辑
          </div>
        </div>

        {editing &&
        <div className={"expandable-content " + (editing ? "is-expanded" : "")}>
          <div className="form-text">
            {this.renderAttrEditor()}
            <div className="padding-text"/>
          </div>
          <div className="actions">
            <div className="ui gray deny button" onClick={this.cancelAttrChange}>
              取消
            </div>
            <div className="ui blue right labeled icon button" onClick={this.confirmAttrChange}>
              确认
              <i className="checkmark icon"/>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}