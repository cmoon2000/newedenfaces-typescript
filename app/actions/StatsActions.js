"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var StatsActions = (function (_super) {
    __extends(StatsActions, _super);
    function StatsActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('getStatsSuccess', 'getStatsFail');
        return _this;
    }
    StatsActions.prototype.getStats = function () {
        var _this = this;
        $.ajax({ url: '/api/stats' })
            .done(function (data) { return _this.actions.getStatsSuccess(data); })
            .fail(function (jqXhr) { return _this.actions.getStatsFail(jqXhr); });
    };
    return StatsActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(StatsActions);
