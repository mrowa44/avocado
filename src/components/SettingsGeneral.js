import React, { Component } from 'react';

import {
  FETCHED_ALWAYS_ON_TOP,
  FETCHED_DAILY_GOAL,
  FETCH_ALWAYS_ON_TOP,
  FETCH_DAILY_GOAL,
  UPDATE_ALWAYS_ON_TOP,
  UPDATE_DAILY_GOAL,
} from '../constants';
import './SettingsGeneral.css';

const { ipcRenderer: ipc } = window.require('electron');

class SettingsGeneral extends Component {
  constructor() {
    super();
    this.updateGoal = this.updateGoal.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateAlwaysOnTop = this.updateAlwaysOnTop.bind(this);
    this.state = {
      currentGoal: 0,
      isAlwaysOnTop: false,
    };
  }

  componentDidMount() {
    ipc.send(FETCH_DAILY_GOAL);
    ipc.on(FETCHED_DAILY_GOAL, (event, currentGoal) => {
      this.setState({ currentGoal });
    });

    ipc.send(FETCH_ALWAYS_ON_TOP);
    ipc.on(FETCHED_ALWAYS_ON_TOP, (event, isAlwaysOnTop) => {
      this.setState({ isAlwaysOnTop });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_DAILY_GOAL);
  }

  updateGoal(event) {
    event.preventDefault();
    const input = this.input;
    const value = input.value;
    if (value !== '' && value > 0) {
      ipc.send(UPDATE_DAILY_GOAL, value);
      input.value = '';
    }
  }

  updateInput(event) {
    this.setState({ currentGoal: this.input.value });
    this.updateGoal(event);
  }

  updateAlwaysOnTop() {
    ipc.send(UPDATE_ALWAYS_ON_TOP, !this.state.isAlwaysOnTop);
  }

  render() {
    return (
      <div className="settings-general">
        <form onSubmit={this.updateGoal} className="form-group">
          <label htmlFor="goal">Daily pomodoro goal</label>
          <input
            id="goal"
            className="form-control"
            type="number"
            value={this.state.currentGoal}
            onChange={this.updateInput}
            ref={(node) => { this.input = node; }}
          />
        </form>
        <div className="settings-general__alwaysOnTop">
          <label htmlFor="alwaysOnTop">Always on top when collapsed</label>
          <input
            id="alwaysOnTop"
            type="checkbox"
            value={this.state.isAlwaysOnTop}
            onChange={this.updateAlwaysOnTop}
          />
        </div>
      </div>
    );
  }
}

export default SettingsGeneral;
