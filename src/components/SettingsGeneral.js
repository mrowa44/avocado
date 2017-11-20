import React, { Component } from 'react';

import {
  FETCHED_ALWAYS_ON_TOP,
  FETCHED_DAILY_GOAL,
  FETCHED_DOCK_ICON_HIDDEN,
  FETCH_ALWAYS_ON_TOP,
  FETCH_DAILY_GOAL,
  FETCH_DOCK_ICON_HIDDEN,
  UPDATE_ALWAYS_ON_TOP,
  UPDATE_DAILY_GOAL,
  UPDATE_HIDE_DOCK_ICON,
} from '../constants';
import './SettingsGeneral.css';

const { ipcRenderer: ipc } = window.require('electron');

class SettingsGeneral extends Component {
  constructor() {
    super();
    this.updateGoal = this.updateGoal.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateAlwaysOnTop = this.updateAlwaysOnTop.bind(this);
    this.updateIconHiding = this.updateIconHiding.bind(this);
    this.state = {
      currentGoal: 0,
      hideDockIcon: false,
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
    ipc.send(FETCH_DOCK_ICON_HIDDEN);
    ipc.on(FETCHED_DOCK_ICON_HIDDEN, (event, isDockIconHidden) => {
      this.setState({ hideDockIcon: isDockIconHidden });
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

  updateIconHiding() {
    ipc.send(UPDATE_HIDE_DOCK_ICON, !this.state.hideDockIcon);
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
        <div className="settings-general__checkbox">
          <label htmlFor="alwaysOnTop">Always on top when collapsed</label>
          <input
            id="alwaysOnTop"
            type="checkbox"
            checked={this.state.isAlwaysOnTop}
            onChange={this.updateAlwaysOnTop}
          />
        </div>
        <div className="settings-general__checkbox">
          <label htmlFor="alwaysOnTop">Hide dock icon</label>
          <input
            id="hideDockIcon"
            type="checkbox"
            checked={this.state.hideDockIcon}
            onChange={this.updateIconHiding}
          />
        </div>
      </div>
    );
  }
}

export default SettingsGeneral;
