import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Bullets.css';

class Bullets extends Component {
  constructor() {
    super();
    this.state = {
      isChanging: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.done !== nextProps.done) {
      this.setState({ isChanging: true });
      this.timer = setTimeout(() => {
        this.setState({ isChanging: false });
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { done, remaining } = this.props;
    const left = Math.max(remaining, 0);
    const doneClassName = cx('bullets__done', {
      'bullets__done--changing': this.state.isChanging,
    });

    return (
      <div className="bullets">
        {done ?
          <div className={doneClassName}>
            {
              [...Array(done)].map(() => (<div
                className="bullets__bullet bullets__bullet--done"
              />))
            }
          </div>
          : null
        }
        {remaining ?
          <div className="bullets__remaining">
            {
              [...Array(left)].map(() => (<div
                className="bullets__bullet bullets__bullet--remaining"
              />))
            }
          </div>
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
