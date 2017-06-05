import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Task.css';

class Task extends Component {
  render() {
    return (
      <li className="task list-group-item">
        <div className="checkbox">
          <label htmlFor="task">
            <input type="checkbox" />
            {this.props.text}
          </label>
        </div>
      </li>
    );
  }
}

Task.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Task;
