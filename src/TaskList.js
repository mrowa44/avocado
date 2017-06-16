import React, { Component } from 'react';

import {
  FETCHED_TASKS,
  FETCH_TASKS,
} from './constants';
import Task from './Task';
import './TaskList.css';

const { ipcRenderer: ipc } = window.require('electron');

class TaskList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    ipc.send(FETCH_TASKS);
    ipc.on(FETCHED_TASKS, (event, tasks) => {
      this.setState({ tasks });
    });
  }

  render() {
    return (
      <ul className="task-list list-group">
        { this.state.tasks.map(task => <Task text={task.text} key={task.id} />) }
      </ul>
    );
  }
}

export default TaskList;
