import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import cx from 'classnames';
import moment from 'moment';

import {
  ADD_TODO,
  COLLAPSE_WINDOW,
  EXPAND_WINDOW,
  FETCHED_COLLAPSE,
  FETCH_COLLAPSE,
  POMODORO_START,
} from './constants';
import './Header.css';

const { ipcRenderer: ipc } = window.require('electron');

class Header extends Component {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    ipc.send(FETCH_COLLAPSE);
    ipc.on(FETCHED_COLLAPSE, (event, collapsed) => {
      this.setState({ collapsed });
    });
    Mousetrap.bind('command+l', () => {
      this.input.focus();
    });
    Mousetrap.bind('esc', () => {
      this.input.blur();
    });
  }

  toggleCollapse() {
    const isCollapsing = !this.state.collapsed;
    this.setState({ collapsed: isCollapsing });
    if (isCollapsing) {
      ipc.send(COLLAPSE_WINDOW);
    } else {
      ipc.send(EXPAND_WINDOW);
    }
  }

  addTodo(event) {
    event.preventDefault();
    const input = this.input;
    const value = input.value;
    const num = Number(value);
    if (value !== '' && Number.isInteger(num) && num > 0) {
      ipc.send(POMODORO_START, num, moment().format());
      input.value = '';
      input.blur();
    } else if (value !== '') {
      ipc.send(ADD_TODO, value);
      input.value = '';
    }
  }

  render() {
    const collapseClass = cx('header__collapse', {
      'header__collapse--collapsed': this.state.collapsed,
    });
    return (
      <header className="header toolbar toolbar-header">
        <div className="header__drag" />
        <div className="toolbar-actions">
          <form onSubmit={this.addTodo}>
            <input
              className="form-control mousetrap"
              type="text"
              placeholder="+ Add a task or start timer"
              ref={(node) => { this.input = node; }}
            />
          </form>
        </div>
        <button
          type="button"
          className={collapseClass}
          onClick={this.toggleCollapse}
        />
      </header>
    );
  }
}

export default Header;
