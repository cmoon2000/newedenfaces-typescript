"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var App_1 = require("./components/App");
var Home_1 = require("./components/Home");
var AddCharacter_1 = require("./components/AddCharacter");
var Character_1 = require("./components/Character");
var CharacterList_1 = require("./components/CharacterList");
var Stats_1 = require("./components/Stats");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (React.createElement(react_router_1.Route, { component: App_1.default },
    React.createElement(react_router_1.Route, { path: '/', component: Home_1.default }),
    React.createElement(react_router_1.Route, { path: '/add', component: AddCharacter_1.default }),
    React.createElement(react_router_1.Route, { path: '/characters/:id', component: Character_1.default }),
    React.createElement(react_router_1.Route, { path: '/shame', component: CharacterList_1.default }),
    React.createElement(react_router_1.Route, { path: '/stats', component: Stats_1.default }),
    React.createElement(react_router_1.Route, { path: ':category', component: CharacterList_1.default },
        React.createElement(react_router_1.Route, { path: ':race', component: CharacterList_1.default },
            React.createElement(react_router_1.Route, { path: ':bloodline', component: CharacterList_1.default })))));
