/* eslint no-console:0, react/no-multi-comp:0, no-alert:0 */

import './assets/index.less';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';

class Todo extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    end: PropTypes.func,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    end() {},
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    console.log(this.props.children);
    this.props.end();
  }

  render() {
    const props = this.props;
    const style = {
      width: 100,
      border: '1px solid red',
      padding: 10,
      margin: 10,
    };
    return (
      <div onClick={this.props.onClick} style={style}>
        {props.children}
      </div>
    );
  }
}

class TodoList extends React.Component {
  state = {
    items: ['hello', 'world', 'click', 'me'],
  }

  handleAdd = () => {
    const items = this.state.items.concat([prompt('Enter some text')]);
    this.setState({ items });
  }

  handleRemove = (i) => {
    const items = this.state.items.concat();
    items.splice(i, 1);
    this.setState({ items });
  }

  render() {
    const items = this.state.items.map((item, i) => {
      return (
        <Todo key={item} onClick={this.handleRemove.bind(this, i)}>
          {item}
        </Todo>
      );
    });
    return (
      <div>
        <button onClick={this.handleAdd}>Add Item</button>
        <Animate transitionName="fade">
          {items}
        </Animate>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <h2>Todo</h2>
    <TodoList />
  </div>,
  document.getElementById('__react-content')
);
