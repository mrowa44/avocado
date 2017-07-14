import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Task.css';

const {
  TOGGLE_DONE,
} = require('./constants');

const { ipcRenderer: ipc } = window.require('electron');

class Task extends Component {
  constructor(props) {
    super(props);
    this.toggleDone = this.toggleDone.bind(this);
    this.setActive = this.setActive.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && nextProps.active !== this.props.active && this.node) {
      this.node.scrollIntoViewIfNeeded();
    }
  }

  setActive() {
    this.props.setActive(this.props.id);
  }

  toggleDone() {
    ipc.send(TOGGLE_DONE, this.props.id);
  }

  render() {
    const className = cx('task', 'list-group-item', {
      'task--active': this.props.active,
    });

    return (
      <li
        className={className}
        onClick={this.setActive}
        role="presentation"
        ref={(node) => { this.node = node; }}
      >
        <input
          type="checkbox"
          checked={this.props.done}
          onChange={this.toggleDone}
        />
        <div className="task__text">
          {this.props.text}
        </div>
        {this.props.isFocus && <span className="task__focus">F</span>}
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
