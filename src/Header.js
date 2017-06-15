import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Mousetrap from 'mousetrap';

import { addTask } from './actions/taskList';
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
    ipc.send('dupa');

    event.preventDefault();
    const input = this.input;
    if (input.value !== '') {
      this.props.dispatch(addTask({
        done: false,
        text: input.value,
      }));
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

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Header);
