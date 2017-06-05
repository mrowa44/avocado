import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Button.css';

class Button extends Component {
  render() {
    return (
      <button className={`btn btn-${this.props.kind}`}>
        {this.props.text}
      </button>
    );
  }
}

Button.propTypes = {
  kind: PropTypes.oneOf('default', 'primary', 'positive', 'negative', 'warning'),
  text: PropTypes.string.isRequired,
};

Button.defaultProps = {
  kind: 'default',
};

export default Button;
