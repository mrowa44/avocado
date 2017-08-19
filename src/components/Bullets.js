import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Bullets.css';

class Bullets extends Component {
  render() {
    const { done, remaining } = this.props;
    const left = Math.max(remaining, 0);
    const sum = left + done;

    return (
      <div className="bullets">
        {
          [...Array(sum)].map((_, index) => {
            if (index < done) {
              return <div className="bullets__bullet bullets__bullet--done" />;
            }
            return <div className="bullets__bullet bullets__bullet--remaining" />;
          })
        }
      </div>
    );
  }
}

Bullets.propTypes = {
  done: PropTypes.number.isRequired,
  remaining: PropTypes.number.isRequired,
};

export default Bullets;
