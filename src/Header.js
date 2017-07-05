import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import cx from 'classnames';

import {
  ADD_TODO,
  COLLAPSE_WINDOW,
  EXPAND_WINDOW,
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
    Mousetrap.bind('command+l', () => {
      this.input.focus();
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
    if (input.value !== '') {
      ipc.send(ADD_TODO, input.value);
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
              className="form-control"
              type="text"
              placeholder="+ Add a task"
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
