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
    this.setActive = this.setActive.bind(this);
    this.state = {
      tasks: [],
      activeId: null,
    };
  }

  componentDidMount() {
    ipc.send(FETCH_TASKS);
    ipc.on(FETCHED_TASKS, (event, tasks) => {
      this.setState({ tasks });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_TASKS);
  }

  setActive(id) {
    this.setState({ activeId: id });
  }

  render() {
    return (
      <ul className="task-list list-group">
        { this.state.tasks.map(task => (
          <Task
            {...task}
            key={task.id}
            active={task.id === this.state.activeId}
            setActive={this.setActive}
          />),
        ) }
      </ul>
    );
  }
}

export default TaskList;
