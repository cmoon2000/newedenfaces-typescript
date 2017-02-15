"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var ReactDOM = require("react-dom");
var react_router_2 = require("react-router");
var routes_1 = require("./routes");
ReactDOM.render(React.createElement(react_router_1.Router, { history: react_router_2.browserHistory }, routes_1.default), document.getElementById('app'));
