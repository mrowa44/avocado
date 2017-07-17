import React, { Component } from 'react';

import {
  FETCHED_DAILY_GOAL,
  FETCH_DAILY_GOAL,
  UPDATE_DAILY_GOAL,
} from '../constants';

const { ipcRenderer: ipc } = window.require('electron');

class SettingsGeneral extends Component {
  constructor() {
    super();
    this.updateGoal = this.updateGoal.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.state = {
      currentGoal: 0,
    };
  }

  componentDidMount() {
    ipc.send(FETCH_DAILY_GOAL);
    ipc.on(FETCHED_DAILY_GOAL, (event, currentGoal) => {
      this.setState({ currentGoal });
    });
  }

  updateGoal(event) {
    event.preventDefault();
    const input = this.input;
    const value = input.value;
    if (value !== '' && value > 0) {
      ipc.send(UPDATE_DAILY_GOAL, value);
      input.value = '';
      input.blur();
    }
  }

  updateInput() {
    this.setState({ currentGoal: this.input.value });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.updateGoal} className="form-group">
          <label htmlFor="goal">Daily pomodoro goal</label>
          <input
            className="form-control"
            type="number"
            value={this.state.currentGoal}
            onChange={this.updateInput}
            ref={(node) => { this.input = node; }}
          />
        </form>
      </div>
    );
  }
}

export default SettingsGeneral;
