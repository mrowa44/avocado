import React, { Component } from 'react';

import Button from '../components/Button';
import SettingsGeneral from '../components/SettingsGeneral';
import './Settings.css';

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      activeBtn: 'general',
    };
    this.showGeneral = this.showGeneral.bind(this);
  }

  showGeneral() {
    this.setState({ activeBtn: 'general' });
  }

  render() {
    const { activeBtn } = this.state;

    return (
      <div className="window settings">
        <header className="toolbar toolbar-header settings__header">
          <h1 className="title">Settings</h1>
        </header>
        <div className="btn-group settings__buttons">
          <Button
            text="General"
            kind={activeBtn === 'general' ? 'primary' : 'default'}
            onClick={this.showGeneral}
          />
        </div>
        {activeBtn === 'general' && <SettingsGeneral /> }
      </div>
    );
  }
}

export default Settings;
