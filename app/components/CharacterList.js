"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var underscore_1 = require("underscore");
var CharacterListStore_1 = require("../stores/CharacterListStore");
var CharacterListActions_1 = require("../actions/CharacterListActions");
var CharacterList = (function (_super) {
    __extends(CharacterList, _super);
    function CharacterList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = CharacterListStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    CharacterList.prototype.componentDidMount = function () {
        CharacterListStore_1.default.listen(this.onChange);
        CharacterListActions_1.default.getCharacters(this.props.params);
    };
    CharacterList.prototype.componentWillUnmount = function () {
        CharacterListStore_1.default.unlisten(this.onChange);
    };
    CharacterList.prototype.componentDidUpdate = function (prevProps) {
        if (!underscore_1.isEqual(prevProps.params, this.props.params)) {
            CharacterListActions_1.default.getCharacters(this.props.params);
        }
    };
    CharacterList.prototype.onChange = function (state) {
        this.setState(state);
    };
    CharacterList.prototype.render = function () {
        var charactersList = this.state.characters.map(function (character, index) {
            return (React.createElement("div", { key: character.characterId, className: 'list-group-item animated fadeIn' },
                React.createElement("div", { className: 'media' },
                    React.createElement("span", { className: 'position pull-left' }, index + 1),
                    React.createElement("div", { className: 'pull-left thumb-lg' },
                        React.createElement(react_router_1.Link, { to: '/characters/' + character.characterId },
                            React.createElement("img", { className: 'media-object', src: 'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg' }))),
                    React.createElement("div", { className: 'media-body' },
                        React.createElement("h4", { className: 'media-heading' },
                            React.createElement(react_router_1.Link, { to: '/characters/' + character.characterId }, character.name)),
                        React.createElement("small", null,
                            "Race: ",
                            React.createElement("strong", null, character.race)),
                        React.createElement("br", null),
                        React.createElement("small", null,
                            "Bloodline: ",
                            React.createElement("strong", null, character.bloodline)),
                        React.createElement("br", null),
                        React.createElement("small", null,
                            "Wins: ",
                            React.createElement("strong", null, character.wins),
                            " Losses: ",
                            React.createElement("strong", null, character.losses))))));
        });
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'list-group' }, charactersList)));
    };
    return CharacterList;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CharacterList;
