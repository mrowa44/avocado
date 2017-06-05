import React, { Component } from 'react';

import Button from './Button';
import './Pomodoro.css';

class Pomodoro extends Component {
  render() {
    return (
      <div className="pomodoro">
        <div className="pomodoro-buttons">
          <Button text="5 min" />
          <Button text="10 min" />
          <Button text="15 min" />
          <Button text="20 min" />
          <Button text="25 min" />
          <Button text="30 min" />
          <Button text="35 min" />
          <Button text="40 min" />
          <Button text="45 min" />
          <Button text="50 min" />
          <Button text="55 min" />
          <Button text="60 min" />
        </div>
      </div>
    );
  }
}

export default Pomodoro;
