import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Button.css';

class Button extends PureComponent {
  render() {
    return (
      <button className={`btn btn-${this.props.kind}`} onClick={this.props.onClick}>
        {this.props.text}
      </button>
    );
  }
}

Button.propTypes = {
  kind: PropTypes.oneOf(['default', 'primary', 'positive', 'negative', 'warning']),
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

Button.defaultProps = {
  kind: 'default',
};

export default Button;
