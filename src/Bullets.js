import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Bullets.css';

class Bullets extends Component {
  render() {
    return (
      <div className="bullets">
        {[...Array(this.props.done)].map(() => (<div
          className="bullets__bullet bullets__bullet--done"
        />))}
        {[...Array(this.props.remaining)].map(() => (<div
          className="bullets__bullet bullets__bullet--remaining"
        />))}
      </div>
    );
  }
}

Bullets.propTypes = {
  done: PropTypes.number.isRequired,
  remaining: PropTypes.number.isRequired,
};

export default Bullets;
