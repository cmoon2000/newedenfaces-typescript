import * as React from 'react';
import { Router } from 'react-router';
import * as ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
// let createBrowserHistory = require('history/lib/createBrowserHistory');
import routes from './routes';

// const history = createBrowserHistory.default();

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));