import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import './TaskList.css';

class TaskList extends Component {
  componentDidMount() {
    // fetch tasks
  }

  render() {
    return (
      <ul className="task-list list-group">
        { this.props.taskList.map(task => <Task text={task.text} key={task.id} />) }
      </ul>
    );
  }
}

TaskList.propTypes = {
  taskList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TaskList.defaultProps = {
  taskList: [],
};

export default TaskList;
