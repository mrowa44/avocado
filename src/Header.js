import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="header toolbar toolbar-header">
        <div className="header-drag" />

        <div className="toolbar-actions">
          <input className="form-control" type="text" placeholder="+ Add a task" />
        </div>
      </header>
    );
  }
}

export default Header;
