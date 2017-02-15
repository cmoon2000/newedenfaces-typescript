"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var FooterStore_1 = require("../stores/FooterStore");
var FooterActions_1 = require("../actions/FooterActions");
var Footer = (function (_super) {
    __extends(Footer, _super);
    function Footer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = FooterStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Footer.prototype.componentDidMount = function () {
        FooterStore_1.default.listen(this.onChange);
        FooterActions_1.default.getTopCharacters();
    };
    Footer.prototype.componentWillUnmount = function () {
        FooterStore_1.default.unlisten(this.onChange);
    };
    Footer.prototype.onChange = function (state) {
        this.setState(state);
    };
    Footer.prototype.render = function () {
        var leaderboardCharacters = this.state.characters.map(function (character) {
            return (React.createElement("li", { key: character.characterId },
                React.createElement(react_router_1.Link, { to: '/characters/' + character.characterId },
                    React.createElement("img", { className: 'thumb-md', src: 'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg' }))));
        });
        return (React.createElement("footer", null,
            React.createElement("div", { className: 'container' },
                React.createElement("div", { className: 'row' },
                    React.createElement("div", { className: 'col-sm-5' },
                        React.createElement("h3", { className: 'lead' },
                            React.createElement("strong", null, "Information"),
                            " and ",
                            React.createElement("strong", null, "Copyright")),
                        React.createElement("p", null,
                            "Powered by ",
                            React.createElement("strong", null, "Node.js"),
                            ", ",
                            React.createElement("strong", null, "MongoDB"),
                            " and ",
                            React.createElement("strong", null, "React"),
                            " with Flux architecture and server-side rendering."),
                        React.createElement("p", null,
                            "You may view the ",
                            React.createElement("a", { href: 'https://github.com/sahat/newedenfaces-react' }, "Source Code"),
                            " behind this project on GitHub."),
                        React.createElement("p", null, "\u00A9 2015 Sahat Yalkabov.")),
                    React.createElement("div", { className: 'col-sm-7 hidden-xs' },
                        React.createElement("h3", { className: 'lead' },
                            React.createElement("strong", null, "Leaderboard"),
                            " Top 5 Characters"),
                        React.createElement("ul", { className: 'list-inline' }, leaderboardCharacters))))));
    };
    return Footer;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
