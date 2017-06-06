import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <li className="task list-group-item">
        <input type="checkbox" />
        <div className="task__text">
          {this.props.text}
        </div>
      </li>
    );
  }
}

Task.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Task;
