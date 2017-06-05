import React, { Component } from 'react';

import Button from './Button';
import './Pomodoro.css';

class Pomodoro extends Component {
  render() {
    return (
      <div className="pomodoro">
        <div className="pomodoro-buttons">
          <Button text="25 + 5" />
          <Button text="25 + 15" />
          <Button text="55 + 5" />
          <Button text="55 + 15" />
        </div>
      </div>
    );
  }
}

export default Pomodoro;
