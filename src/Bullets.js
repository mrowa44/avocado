import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Bullets.css';

class Bullets extends Component {
  render() {
    const { done, remaining } = this.props;
    return (
      <div className="bullets">
        {done ?
            [...Array(done)].map(() => (<div
              className="bullets__bullet bullets__bullet--done"
            />))
          : null
        }
        {remaining ?
            [...Array(remaining)].map(() => (<div
              className="bullets__bullet bullets__bullet--remaining"
            />))
          : null
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
