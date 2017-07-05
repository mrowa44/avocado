import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';

import Button from './Button';
import Bullets from './Bullets';
import {
  FETCHED_POMODOROS,
  FETCH_POMODOROS,
  POMODORO_FINISHED,
  POMODORO_START,
  POMODORO_TIME,
} from './constants';
import { formatToday } from './helpers';
import './Pomodoro.css';

const { ipcRenderer: ipc } = window.require('electron');
const INTERVAL_TIME = 990;

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
      startTime: null,
      duration: 0,
      minutes: 0,
      seconds: 0,
      running: false,
      pomodoros: {
        done: 0,
        goal: 0,
      },
    };
  }

  componentDidMount() {
    ipc.send(FETCH_POMODOROS);
    ipc.on(FETCHED_POMODOROS, (event, pomodoros) => {
      const current = pomodoros.current;
      const startTime = current && moment(current.startTime);
      const duration = current && current.duration;
      if (startTime && duration) {
        const diff = moment().diff(startTime);
        if (diff <= duration * 60 * 1000) {
          this.setTime(diff, duration);
          this.timer = setInterval(this.updateTime, INTERVAL_TIME);
        } else {
          ipc.send(POMODORO_FINISHED);
        }
      }
      this.setState({
        pomodoros: {
          done: pomodoros[formatToday()],
          goal: pomodoros.goal,
        },
        startTime,
        duration,
        running: !!current,
      });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners(FETCHED_POMODOROS);
  }

  setTime(timePassed, duration) {
    const left = (duration * 60 * 1000) - timePassed;
    const time = moment.duration(left, 'milliseconds');
    const minutes = Math.floor(time.asMinutes());
    const seconds = Math.floor(time.asSeconds() % 60);
    const secString = seconds < 10 ? `0${seconds}` : seconds;
    this.setState({
      minutes,
      seconds: secString,
    });
    ipc.send(POMODORO_TIME, `${minutes}:${secString}`);
  }

  startTimer(minutes) {
    const startTime = moment();
    ipc.send(POMODORO_START, minutes, startTime.format());
    this.setState({
      startTime,
      duration: minutes,
      minutes,
      seconds: '00',
      running: true,
    }, () => {
      this.timer = setInterval(this.updateTime, INTERVAL_TIME);
      ipc.send(POMODORO_TIME, `${minutes}:00`);
    });
  }

  updateTime() {
    const { startTime, duration } = this.state;
    const timePassed = moment().diff(startTime);
    if (timePassed >= duration * 60 * 1000) {
      this.endTimer();
    } else {
      this.setTime(timePassed, duration);
    }
  }

  endTimer() {
    this.constructor.sendNotification();
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      startTime: null,
      duration: 0,
      minutes: 0,
      seconds: 0,
      running: false,
    });
    ipc.send(POMODORO_FINISHED);
  }

  handleButtonClick(minutes) {
    return () => { this.startTimer(minutes); };
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
            {minutes}:{seconds}
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
