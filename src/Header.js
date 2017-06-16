import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

import {
  ADD_TODO,
} from './constants';
import './Header.css';

const { ipcRenderer: ipc } = window.require('electron');

class Header extends Component {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('command+l', () => {
      this.input.focus();
    });
  }

  addTodo(event) {
    event.preventDefault();
    const input = this.input;
    if (input.value !== '') {
      ipc.send(ADD_TODO, input.value);
      input.value = '';
    }
  }

  render() {
    return (
      <header className="header toolbar toolbar-header">
        <div className="header-drag" />
        <div className="toolbar-actions">
          <form onSubmit={this.addTodo}>
            <input
              className="form-control"
              type="text"
              placeholder="+ Add a task"
              ref={(node) => { this.input = node; }}
            />
          </form>
        </div>
      </header>
    );
  }
}

export default Header;
