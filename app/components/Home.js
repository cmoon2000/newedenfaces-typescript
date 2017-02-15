"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var underscore_1 = require("underscore");
var HomeStore_1 = require("../stores/HomeStore");
var HomeActions_1 = require("../actions/HomeActions");
var Home = (function (_super) {
    __extends(Home, _super);
    function Home(props) {
        var _this = _super.call(this, props) || this;
        _this.state = HomeStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Home.prototype.componentDidMount = function () {
        HomeStore_1.default.listen(this.onChange);
        HomeActions_1.default.getTwoCharacters();
    };
    Home.prototype.componentWillUnmount = function () {
        HomeStore_1.default.unlisten(this.onChange);
    };
    Home.prototype.onChange = function (state) {
        this.setState(state);
    };
    Home.prototype.handleClick = function (character) {
        var winner = character.characterId;
        var loser = underscore_1.first(underscore_1.without(this.state.characters, underscore_1.findWhere(this.state.characters, { characterId: winner }))).characterId;
        HomeActions_1.default.vote(winner, loser);
    };
    Home.prototype.render = function () {
        var _this = this;
        var characterNodes = this.state.characters.map(function (character, index) {
            return (React.createElement("div", { key: character.characterId, className: index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5' },
                React.createElement("div", { className: 'thumbnail fadeInUp animated' },
                    React.createElement("img", { onClick: _this.handleClick.bind(_this, character), src: 'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg' }),
                    React.createElement("div", { className: 'caption text-center' },
                        React.createElement("ul", { className: 'list-inline' },
                            React.createElement("li", null,
                                React.createElement("strong", null, "Race:"),
                                " ",
                                character.race),
                            React.createElement("li", null,
                                React.createElement("strong", null, "Bloodline:"),
                                " ",
                                character.bloodline)),
                        React.createElement("h4", null,
                            React.createElement(react_router_1.Link, { to: '/characters/' + character.characterId },
                                React.createElement("strong", null, character.name)))))));
        });
        return (React.createElement("div", { className: 'container' },
            React.createElement("h3", { className: 'text-center' }, "Click on the portrait. Select your favorite."),
            React.createElement("div", { className: 'row' }, characterNodes)));
    };
    return Home;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
