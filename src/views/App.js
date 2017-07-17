import React, { Component } from 'react';

import Header from '../components/Header';
import Pomodoro from '../components/Pomodoro';
import TaskList from '../components/TaskList';
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
