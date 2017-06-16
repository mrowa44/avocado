import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Task.css';

const {
  TOGGLE_DONE,
} = require('./constants');

const { ipcRenderer: ipc } = window.require('electron');

class Task extends Component {
  constructor(props) {
    super(props);
    this.toggleDone = this.toggleDone.bind(this);
  }

  toggleDone() {
    ipc.send(TOGGLE_DONE, this.props.id);
  }

  render() {
    return (
      <li className="task list-group-item">
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
  done: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default Task;
