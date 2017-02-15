"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var StatsStore_1 = require("../stores/StatsStore");
var StatsActions_1 = require("../actions/StatsActions");
var Stats = (function (_super) {
    __extends(Stats, _super);
    function Stats(props) {
        var _this = _super.call(this, props) || this;
        _this.state = StatsStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Stats.prototype.componentDidMount = function () {
        StatsStore_1.default.listen(this.onChange);
        StatsActions_1.default.getStats();
    };
    Stats.prototype.componentWillUnmount = function () {
        StatsStore_1.default.unlisten(this.onChange);
    };
    Stats.prototype.onChange = function (state) {
        this.setState(state);
    };
    Stats.prototype.render = function () {
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'panel panel-default' },
                React.createElement("table", { className: 'table table-striped' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", { colSpan: 2 }, "Stats"))),
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "Leading race in Top 100"),
                            React.createElement("td", null,
                                this.state.leadingRace.race,
                                " with ",
                                this.state.leadingRace.count,
                                " characters")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Leading bloodline in Top 100"),
                            React.createElement("td", null,
                                this.state.leadingBloodline.bloodline,
                                " with ",
                                this.state.leadingBloodline.count,
                                " characters")),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Amarr Characters"),
                            React.createElement("td", null, this.state.amarrCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Caldari Characters"),
                            React.createElement("td", null, this.state.caldariCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Gallente Characters"),
                            React.createElement("td", null, this.state.gallenteCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Minmatar Characters"),
                            React.createElement("td", null, this.state.minmatarCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Total votes cast"),
                            React.createElement("td", null, this.state.totalVotes)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Female characters"),
                            React.createElement("td", null, this.state.femaleCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Male characters"),
                            React.createElement("td", null, this.state.maleCount)),
                        React.createElement("tr", null,
                            React.createElement("td", null, "Total number of characters"),
                            React.createElement("td", null, this.state.totalCount)))))));
    };
    return Stats;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stats;
