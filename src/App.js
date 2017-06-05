import React, { Component } from 'react';

import Header from './Header';
import Pomodoro from './Pomodoro';
import TaskList from './TaskList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app window">
        <Header />
        <Pomodoro />
        <TaskList />
      </div>
    );
  }
}

export default App;
