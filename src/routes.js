import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import App from './views/App';
import Settings from './views/Settings';

const Routes = props => (
  <Router {...props}>
    <div>
      <Route path="/" exact component={App} />
      <Route path="/settings" component={Settings} />
    </div>
  </Router>
);

export default Routes;
