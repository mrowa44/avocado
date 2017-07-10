import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

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
    this.setActiveDown = this.setActiveDown.bind(this);
    this.setActiveUp = this.setActiveUp.bind(this);
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

    Mousetrap.bind('command+j', this.setActiveDown);
    Mousetrap.bind('command+k', this.setActiveUp);
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_TASKS);
  }

  setActiveDown() {
    const { tasks, activeId } = this.state;
    const ids = tasks.map(t => t.id);
    const activeIndex = ids.indexOf(activeId);
    const maxIndex = ids[ids.length - 1];
    const nextActiveIndex = activeIndex + 1;
    const nextActiveId = ids[nextActiveIndex];
    if (nextActiveIndex >= maxIndex) {
      this.setActive(ids[0]);
    } else {
      this.setActive(nextActiveId);
    }
  }

  setActiveUp() {
    const { tasks, activeId } = this.state;
    const ids = tasks.map(t => t.id);
    const activeIndex = ids.indexOf(activeId);
    const prevActiveIndex = activeIndex - 1;
    const prevActiveId = ids[prevActiveIndex];
    if (prevActiveIndex < 0) {
      console.log(prevActiveIndex);
      this.setActive(ids[ids.length - 1]);
    } else {
      this.setActive(prevActiveId);
    }
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
