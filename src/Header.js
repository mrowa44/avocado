import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

import './Header.css';

class Header extends Component {
  componentDidMount() {
    Mousetrap.bind('command+l', () => {
      this.input.focus();
    });
  }

  render() {
    return (
      <header className="header toolbar toolbar-header">
        <div className="header-drag" />

        <div className="toolbar-actions">
          <input
            className="form-control"
            type="text"
            placeholder="+ Add a task"
            ref={(node) => { this.input = node; }}
          />
        </div>
      </header>
    );
  }
}

export default Header;
