import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Task.css';

const {
  SET_FOCUS,
  TOGGLE_DONE,
} = require('../constants');

const { ipcRenderer: ipc } = window.require('electron');

class Task extends Component {
  static stopPropagation(event) {
    event.stopPropagation();
  }

  constructor(props) {
    super(props);
    this.toggleDone = this.toggleDone.bind(this);
    this.setActive = this.setActive.bind(this);
    this.setToFocus = this.setToFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && nextProps.active !== this.props.active && this.node) {
      this.node.scrollIntoViewIfNeeded();
    }
  }

  setActive() {
    this.props.setActive(this.props.id);
  }

  setToFocus() {
    const { done } = this.props;
    if (!done) {
      ipc.send(SET_FOCUS, {
        id: this.props.id,
        text: this.props.text,
        done,
      });
    }
  }

  toggleDone(event) {
    event.stopPropagation();
    ipc.send(TOGGLE_DONE, this.props.id);
  }

  render() {
    const { isFocus } = this.props;
    const className = cx('task', 'list-group-item', {
      'task--active': this.props.active,
      'task--focus': isFocus,
    });

    return (
      <li
        className={className}
        onClick={this.setActive}
        onDoubleClick={this.setToFocus}
        role="presentation"
        ref={(node) => { this.node = node; }}
      >
        <input
          type="checkbox"
          checked={this.props.done}
          onChange={this.toggleDone}
          onClick={this.constructor.stopPropagation}
        />
        <div className="task__text">
          {this.props.text}
        </div>
        {isFocus && <span className="icon icon-target task__focus" />}
      </li>
    );
  }
}

Task.propTypes = {
  active: PropTypes.bool.isRequired,
  done: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  isFocus: PropTypes.bool,
  setActive: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

Task.defaultProps = {
  isFocus: false,
};

export default Task;
