import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import { Draggable } from 'react-beautiful-dnd';

import { SET_FOCUS } from '../constants';
import Task from './Task';
import Focus from './Focus';
import DragAndDrop from './DragAndDrop';

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
    this.state = {
      tasks: [],
      activeId: null,
    };
  }

  componentDidMount() {
    Mousetrap.bind(['command+j', 'down'], this.setActiveDown);
    Mousetrap.bind(['command+k', 'up'], this.setActiveUp);
    Mousetrap.bind('command+f', this.setToFocus);
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

  render() {
    const tasks = this.props.tasks;
    return (
      <ul className="task-list list-group" onClick={this.setNoneActive} role="button">
        { tasks.length === 0 ?
          <div className="task-list--empty">
            You don&#39;t have any pending tasks
          </div>
        : null }

        { tasks.map(task => (
          <Draggable key={task.id} draggableId={task.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={provided.draggableStyle}
                {...provided.dragHandleProps}
              >
                <Task
                  {...task}
                  key={task.id}
                  active={task.id === this.state.activeId}
                  setActive={this.setActive}
                  isFocus={task.id === this.props.focusId}
                  isDragged={snapshot.isDragging}
                />
              </div>
            )}
          </Draggable>
        )) }
      </ul>
    );
  }
}

TaskList.propTypes = {
  focusId: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

TaskList.defaultProps = {
  focusId: null,
};

export default Focus(
  DragAndDrop(TaskList),
);
