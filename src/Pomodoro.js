import React, { Component } from 'react';
import cx from 'classnames';

import Button from './Button';
import './Pomodoro.css';

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
    };
  }

  startTimer(minutes) {
    this.setState({
      duration: minutes,
      minutes,
      running: true,
    }, () => {
      this.timer = setInterval(this.updateTime, 1000);
    });
  }

  updateTime() {
    const { minutes: min, seconds: s } = this.state;
    const newTime = s === 0 ? { minutes: min - 1, seconds: 59 } : { minutes: min, seconds: s - 1 };
    this.setState(newTime);

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
      running: false,
      minutes: 0,
      seconds: 0,
      duration: 0,
    });
  }

  handleButtonClick(minutes) {
    return () => {
      this.startTimer(minutes);
    };
  }

  render() {
    const { minutes, seconds, duration, running } = this.state;
    const timerClass = cx('pomodoro-timer', {
      'pomodoro-timer--running': running,
    });
    const secLablel = seconds < 10 ? `0${seconds}` : seconds;
    const percent = 1 - ((minutes + (seconds / 60)) / duration);
    console.log(percent, minutes, seconds, duration);

    return (
      <div className="pomodoro">
        <div className={timerClass}>
          <div
            className="pomodoro-timer__bg"
            style={{ transform: `scaleX(${percent * 100})` }}
          />
          <div className="pomodoro-timer__text">
            {minutes}:{secLablel}
          </div>
        </div>
        <div className="pomodoro-buttons">
          <Button text="5 min" onClick={this.handleButtonClick(5)} />
          <Button text="10 min" onClick={this.handleButtonClick(10)} />
          <Button text="15 min" onClick={this.handleButtonClick(15)} />
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
      </div>
    );
  }
}

export default Pomodoro;
