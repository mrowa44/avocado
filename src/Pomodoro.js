import React, { Component } from 'react';
import cx from 'classnames';

import Button from './Button';
import Bullets from './Bullets';
import {
  FETCHED_POMODOROS,
  FETCH_POMODOROS,
  POMODORO_FINISHED,
  POMODORO_TIME,
} from './constants';
import { formatToday } from './helpers';
import './Pomodoro.css';

const { ipcRenderer: ipc } = window.require('electron');

class Pomodoro extends Component {
  static sendNotification() {
    const title = 'Pomodoro finished';
    const notification = new Notification(title, { // eslint-disable-line no-unused-vars
      title,
      body: 'Take a break :)',
      silent: true,
    });
  }

  constructor() {
    super();
    this.updateTime = this.updateTime.bind(this);
    this.state = {
      duration: 0,
      minutes: 0,
      running: false,
      seconds: 0,
      pomodoros: {
        done: 0,
        goal: 0,
      },
    };
  }

  componentDidMount() {
    ipc.send(FETCH_POMODOROS);
    ipc.on(FETCHED_POMODOROS, (event, pomodoros) => {
      this.setState({ pomodoros: {
        done: pomodoros[formatToday()],
        goal: pomodoros.goal,
      } });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_POMODOROS);
  }

  startTimer(minutes) {
    this.setState({
      duration: minutes,
      minutes,
      running: true,
    }, () => {
      this.timer = setInterval(this.updateTime, 1000);
      ipc.send(POMODORO_TIME, this.formatTimeString());
    });
  }

  updateTime() {
    const { minutes: min, seconds: s } = this.state;
    const newTime = s === 0 ? { minutes: min - 1, seconds: 59 } : { minutes: min, seconds: s - 1 };
    this.setState(newTime, () => {
      ipc.send(POMODORO_TIME, this.formatTimeString());
    });

    if (newTime.minutes === 0 && newTime.seconds === 0) {
      this.endTimer();
    }
  }

  endTimer() {
    this.constructor.sendNotification();
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      duration: 0,
      minutes: 0,
      running: false,
      seconds: 0,
    });
    ipc.send(POMODORO_FINISHED);
  }

  handleButtonClick(minutes) {
    return () => {
      this.startTimer(minutes);
    };
  }

  formatTimeString() {
    const { minutes, seconds } = this.state;
    const secLablel = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${secLablel}`;
  }

  render() {
    const { minutes, seconds, duration, running, pomodoros } = this.state;
    const timerClass = cx('pomodoro-timer', {
      'pomodoro-timer--running': running,
    });
    const percent = 1 - ((minutes + (seconds / 60)) / duration);

    return (
      <div className="pomodoro">
        <div className={timerClass}>
          <div
            className="pomodoro-timer__bg"
            style={{ width: `${percent * 100}%` }}
          />
          <div className="pomodoro-timer__text">
            {this.formatTimeString()}
          </div>
        </div>
        <div className="pomodoro-buttons">
          <Button text="15 min" onClick={this.handleButtonClick(1)} />
          <Button text="20 min" onClick={this.handleButtonClick(20)} />
          <Button text="25 min" onClick={this.handleButtonClick(25)} />
          <Button text="30 min" onClick={this.handleButtonClick(30)} />
          <Button text="35 min" onClick={this.handleButtonClick(35)} />
          <Button text="40 min" onClick={this.handleButtonClick(40)} />
          <Button text="45 min" onClick={this.handleButtonClick(45)} />
          <Button text="50 min" onClick={this.handleButtonClick(50)} />
          <Button text="55 min" onClick={this.handleButtonClick(55)} />
          <Button text="60 min" onClick={this.handleButtonClick(60)} />
        </div>
        <Bullets done={pomodoros.done} remaining={pomodoros.goal - pomodoros.done} />
      </div>
    );
  }
}

export default Pomodoro;
