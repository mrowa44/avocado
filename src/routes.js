import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import App from './views/App';
import Settings from './views/Settings';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={App} />
          <Route path="/settings" component={Settings} />
        </div>
      </Router>
    );
  }
}

export default Routes;
