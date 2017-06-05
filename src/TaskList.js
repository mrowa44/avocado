import React, { Component } from 'react';

import Task from './Task';
import './TaskList.css';

class TaskList extends Component {
  render() {
    return (
      <ul className="task-list list-group">
        <Task text="Take out garbage" />
        <Task text="Go to the gym" />
        <Task text="Buy coffee" />
        <Task text="Build an app" />
        <Task text="Random text" />
      </ul>
    );
  }
}

export default TaskList;
