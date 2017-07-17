import React, { Component } from 'react';

import {
  COMPLETE_FOCUS_TASK,
  FETCHED_FOCUS,
  FETCH_FOCUS,
  GIVE_UP_FOCUS,
} from '../constants';
import Button from './Button';
import './Focus.css';

const { ipcRenderer: ipc } = window.require('electron');

function Focus(PassedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        task: null,
      };
    }

    componentDidMount() {
      ipc.send(FETCH_FOCUS);
      ipc.on(FETCHED_FOCUS, (event, task) => {
        this.setState({ task });
      });
    }

    componentWillUnmount() {
      ipc.removeAllListeners(FETCHED_FOCUS);
    }

    static markDone() {
      ipc.send(COMPLETE_FOCUS_TASK);
    }

    static giveUp() {
      ipc.send(GIVE_UP_FOCUS);
    }

    createFocusComponent() {
      const task = this.state.task;
      if (!task) { return null; }

      return (
        <div className="focus">
          <div className="focus__text">{task.text}</div>
          <div className="focus__buttons">
            <Button text="Done" onClick={this.constructor.markDone} kind="positive" />
            <Button text="Give up" onClick={this.constructor.giveUp} kind="default" />
          </div>
        </div>
      );
    }

    render() {
      const task = this.state.task;
      return (<PassedComponent
        isFocus={!!task}
        focusComponent={this.createFocusComponent()}
        focusId={task && task.id}
        {...this.props}
      />);
    }
  };
}

export default Focus;
