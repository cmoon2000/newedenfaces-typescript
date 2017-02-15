"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var NavbarStore_1 = require("../stores/NavbarStore");
var NavbarActions_1 = require("../actions/NavbarActions");
var Navbar = (function (_super) {
    __extends(Navbar, _super);
    function Navbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = NavbarStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Navbar.prototype.componentDidMount = function () {
        NavbarStore_1.default.listen(this.onChange);
        NavbarActions_1.default.getCharacterCount();
        var socket = io.connect();
        socket.on('onlineUsers', function (data) {
            NavbarActions_1.default.updateOnlineUsers(data);
        });
        $(document).ajaxStart(function () {
            NavbarActions_1.default.updateAjaxAnimation('fadeIn');
        });
        $(document).ajaxComplete(function () {
            setTimeout(function () {
                NavbarActions_1.default.updateAjaxAnimation('fadeOut');
            }, 750);
        });
    };
    Navbar.prototype.componentWillUnmount = function () {
        NavbarStore_1.default.unlisten(this.onChange);
    };
    Navbar.prototype.onChange = function (state) {
        this.setState(state);
    };
    Navbar.prototype.handleSubmit = function (event) {
        event.preventDefault();
        var searchQuery = this.state.searchQuery.trim();
        if (searchQuery) {
            NavbarActions_1.default.findCharacter({
                searchQuery: searchQuery,
                searchForm: this.refs.searchForm,
                history: this.props.history
            });
        }
    };
    Navbar.prototype.render = function () {
        return (React.createElement("nav", { className: 'navbar navbar-default navbar-static-top' },
            React.createElement("div", { className: 'navbar-header' },
                React.createElement("button", { type: 'button', className: 'navbar-toggle collapsed', "data-toggle": 'collapse', "data-target": '#navbar' },
                    React.createElement("span", { className: 'sr-only' }, "Toggle navigation"),
                    React.createElement("span", { className: 'icon-bar' }),
                    React.createElement("span", { className: 'icon-bar' }),
                    React.createElement("span", { className: 'icon-bar' })),
                React.createElement(react_router_1.Link, { to: '/', className: 'navbar-brand' },
                    React.createElement("span", { ref: 'triangles', className: 'triangles animated ' + this.state.ajaxAnimationClass },
                        React.createElement("div", { className: 'tri invert' }),
                        React.createElement("div", { className: 'tri invert' }),
                        React.createElement("div", { className: 'tri' }),
                        React.createElement("div", { className: 'tri invert' }),
                        React.createElement("div", { className: 'tri invert' }),
                        React.createElement("div", { className: 'tri' }),
                        React.createElement("div", { className: 'tri invert' }),
                        React.createElement("div", { className: 'tri' }),
                        React.createElement("div", { className: 'tri invert' })),
                    "NEF",
                    React.createElement("span", { className: 'badge badge-up badge-danger' }, this.state.onlineUsers))),
            React.createElement("div", { id: 'navbar', className: 'navbar-collapse collapse' },
                React.createElement("form", { ref: 'searchForm', className: 'navbar-form navbar-left animated', onSubmit: this.handleSubmit.bind(this) },
                    React.createElement("div", { className: 'input-group' },
                        React.createElement("input", { type: 'text', className: 'form-control', placeholder: this.state.totalCharacters + ' characters', value: this.state.searchQuery, onChange: NavbarActions_1.default.updateSearchQuery }),
                        React.createElement("span", { className: 'input-group-btn' },
                            React.createElement("button", { className: 'btn btn-default', onClick: this.handleSubmit.bind(this) },
                                React.createElement("span", { className: 'glyphicon glyphicon-search' }))))),
                React.createElement("ul", { className: 'nav navbar-nav' },
                    React.createElement("li", null,
                        React.createElement(react_router_1.Link, { to: '/' }, "Home")),
                    React.createElement("li", null,
                        React.createElement(react_router_1.Link, { to: '/stats' }, "Stats")),
                    React.createElement("li", { className: 'dropdown' },
                        React.createElement("a", { href: '#', className: 'dropdown-toggle', "data-toggle": 'dropdown' },
                            "Top 100 ",
                            React.createElement("span", { className: 'caret' })),
                        React.createElement("ul", { className: 'dropdown-menu' },
                            React.createElement("li", null,
                                React.createElement(react_router_1.Link, { to: '/top' }, "Top Overall")),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/top/caldari' }, "Caldari"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/caldari/achura' }, "Achura")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/caldari/civire' }, "Civire")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/caldari/deteis' }, "Deteis")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/top/gallente' }, "Gallente"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/gallente/gallente' }, "Gallente")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/gallente/intaki' }, "Intaki")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/gallente/jin-mei' }, "Jin-Mei")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/top/minmatar' }, "Minmatar"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/minmatar/brutor' }, "Brutor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/minmatar/sebiestor' }, "Sebiestor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/minmatar/vherokior' }, "Vherokior")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/top/amarr' }, "Amarr"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/amarr/amarr' }, "Amarr")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/amarr/ni-kunni' }, "Ni-Kunni")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/top/amarr/khanid' }, "Khanid")))),
                            React.createElement("li", { className: 'divider' }),
                            React.createElement("li", null,
                                React.createElement(react_router_1.Link, { to: '/shame' }, "Hall of Shame")))),
                    React.createElement("li", { className: 'dropdown' },
                        React.createElement("a", { href: '#', className: 'dropdown-toggle', "data-toggle": 'dropdown' },
                            "Female ",
                            React.createElement("span", { className: 'caret' })),
                        React.createElement("ul", { className: 'dropdown-menu' },
                            React.createElement("li", null,
                                React.createElement(react_router_1.Link, { to: '/female' }, "All")),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/female/caldari' }, "Caldari"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/caldari/achura' }, "Achura")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/caldari/civire/' }, "Civire")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/caldari/deteis' }, "Deteis")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/female/gallente' }, "Gallente"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/gallente/gallente' }, "Gallente")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/gallente/intaki' }, "Intaki")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/gallente/jin-mei' }, "Jin-Mei")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/female/minmatar' }, "Minmatar"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/minmatar/brutor' }, "Brutor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/minmatar/sebiestor' }, "Sebiestor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/minmatar/vherokior' }, "Vherokior")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/female/amarr' }, "Amarr"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/amarr/amarr' }, "Amarr")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/amarr/ni-kunni' }, "Ni-Kunni")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/female/amarr/khanid' }, "Khanid")))))),
                    React.createElement("li", { className: 'dropdown' },
                        React.createElement("a", { href: '#', className: 'dropdown-toggle', "data-toggle": 'dropdown' },
                            "Male ",
                            React.createElement("span", { className: 'caret' })),
                        React.createElement("ul", { className: 'dropdown-menu' },
                            React.createElement("li", null,
                                React.createElement(react_router_1.Link, { to: '/male' }, "All")),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/male/caldari' }, "Caldari"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/caldari/achura' }, "Achura")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/caldari/civire' }, "Civire")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/caldari/deteis' }, "Deteis")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/male/gallente' }, "Gallente"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/gallente/gallente' }, "Gallente")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/gallente/intaki' }, "Intaki")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/gallente/jin-mei' }, "Jin-Mei")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/male/minmatar' }, "Minmatar"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/minmatar/brutor' }, "Brutor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/minmatar/sebiestor' }, "Sebiestor")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/minmatar/vherokior' }, "Vherokior")))),
                            React.createElement("li", { className: 'dropdown-submenu' },
                                React.createElement(react_router_1.Link, { to: '/male/amarr' }, "Amarr"),
                                React.createElement("ul", { className: 'dropdown-menu' },
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/amarr/amarr' }, "Amarr")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/amarr/ni-kunni' }, "Ni-Kunni")),
                                    React.createElement("li", null,
                                        React.createElement(react_router_1.Link, { to: '/male/amarr/khanid' }, "Khanid")))))),
                    React.createElement("li", null,
                        React.createElement(react_router_1.Link, { to: '/add' }, "Add"))))));
    };
    return Navbar;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
