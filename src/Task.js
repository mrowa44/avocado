import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <li className="task list-group-item">
        {this.props.text}
      </li>
    );
  }
}

Task.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Task;
