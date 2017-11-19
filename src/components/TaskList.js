import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

import {
  DELETE_TASK,
  FETCHED_TASKS,
  FETCH_TASKS,
  SET_FOCUS,
} from '../constants';
import Task from './Task';
import Focus from './Focus';
import './TaskList.css';

const { ipcRenderer: ipc } = window.require('electron');

class TaskList extends Component {
  constructor() {
    super();
    this.setActive = this.setActive.bind(this);
    this.setActiveDown = this.setActiveDown.bind(this);
    this.setActiveUp = this.setActiveUp.bind(this);
    this.setNoneActive = this.setNoneActive.bind(this);
    this.setToFocus = this.setToFocus.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
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

    Mousetrap.bind(['command+j', 'down'], this.setActiveDown);
    Mousetrap.bind(['command+k', 'up'], this.setActiveUp);
    Mousetrap.bind('command+f', this.setToFocus);
    Mousetrap.bind('command+backspace', this.deleteTask);
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_TASKS);
  }

  setActiveDown() {
    const { tasks, activeId } = this.state;
    const ids = tasks.map(t => t.id);
    const activeIndex = ids.indexOf(activeId);
    const nextActiveIndex = activeIndex + 1;
    const nextActiveId = ids[nextActiveIndex];
    if (nextActiveIndex >= ids.length) {
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
      this.setActive(ids[ids.length - 1]);
    } else {
      this.setActive(prevActiveId);
    }
  }

  setNoneActive(event) {
    if (event.target.classList.contains('task-list')) {
      this.setState({ activeId: null });
    }
  }

  setActive(id) {
    this.setState({ activeId: id });
  }

  setToFocus() {
    const activeId = this.state.activeId;
    if (activeId) {
      const task = this.state.tasks.find(t => t.id === activeId);
      if (!task.done) {
        ipc.send(SET_FOCUS, task);
      }
    }
  }

  deleteTask() {
    ipc.send(DELETE_TASK, this.state.activeId);
  }

  render() {
    const tasks = this.state.tasks;
    return (
      <ul className="task-list list-group" onClick={this.setNoneActive} role="button">
        { tasks.length === 0 ?
          <div className="task-list--empty">
            You don&#39;t have any pending tasks
          </div>
        : null }
        { tasks.map(task => (
          <Task
            {...task}
            key={task.id}
            active={task.id === this.state.activeId}
            setActive={this.setActive}
            isFocus={task.id === this.props.focusId}
          />),
        ) }
      </ul>
    );
  }
}

TaskList.propTypes = {
  focusId: PropTypes.number, // eslint-disable-line react/require-default-props
};

export default Focus(TaskList);
