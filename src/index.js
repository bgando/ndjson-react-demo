import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route } from 'react-router';

import App from './components/App';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
  </Router>
);

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
