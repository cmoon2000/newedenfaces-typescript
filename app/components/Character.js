"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var CharacterStore_1 = require("../stores/CharacterStore");
var CharacterActions_1 = require("../actions/CharacterActions");
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(props) {
        var _this = _super.call(this, props) || this;
        _this.state = CharacterStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Character.prototype.componentDidMount = function () {
        CharacterStore_1.default.listen(this.onChange);
        CharacterActions_1.default.getCharacter(this.props.params.id);
        $('.magnific-popup').magnificPopup({
            type: 'image',
            mainClass: 'mfp-zoom-in',
            closeOnContentClick: true,
            midClick: true,
            zoom: {
                enabled: true,
                duration: 300
            }
        });
    };
    Character.prototype.componentWillUnmount = function () {
        CharacterStore_1.default.unlisten(this.onChange);
        $(document.body).removeClass();
    };
    Character.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.params.id !== this.props.params.id) {
            CharacterActions_1.default.getCharacter(this.props.params.id);
        }
    };
    Character.prototype.onChange = function (state) {
        this.setState(state);
    };
    Character.prototype.render = function () {
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'profile-img' },
                React.createElement("a", { className: 'magnific-popup', href: 'https://image.eveonline.com/Character/' + this.state.characterId + '_1024.jpg' },
                    React.createElement("img", { src: 'https://image.eveonline.com/Character/' + this.state.characterId + '_256.jpg' }))),
            React.createElement("div", { className: 'profile-info clearfix' },
                React.createElement("h2", null,
                    React.createElement("strong", null, this.state.name)),
                React.createElement("h4", { className: 'lead' },
                    "Race: ",
                    React.createElement("strong", null, this.state.race)),
                React.createElement("h4", { className: 'lead' },
                    "Bloodline: ",
                    React.createElement("strong", null, this.state.bloodline)),
                React.createElement("h4", { className: 'lead' },
                    "Gender: ",
                    React.createElement("strong", null, this.state.gender)),
                React.createElement("button", { className: 'btn btn-transparent', onClick: CharacterActions_1.default.report.bind(this, this.state.characterId), disabled: this.state.isReported }, this.state.isReported ? 'Reported' : 'Report Character')),
            React.createElement("div", { className: 'profile-stats clearfix' },
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("span", { className: 'stats-number' }, this.state.winLossRatio),
                        "Winning Percentage"),
                    React.createElement("li", null,
                        React.createElement("span", { className: 'stats-number' }, this.state.wins),
                        " Wins"),
                    React.createElement("li", null,
                        React.createElement("span", { className: 'stats-number' }, this.state.losses),
                        " Losses")))));
    };
    return Character;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Character;
