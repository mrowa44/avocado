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
      <li className={className} onClick={this.setActive} role="presentation">
        <input
          type="checkbox"
          checked={this.props.done}
          onChange={this.toggleDone}
        />
        <div className="task__text">
          {this.props.text}
        </div>
      </li>
    );
  }
}

Task.propTypes = {
  active: PropTypes.bool.isRequired,
  done: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default Task;
