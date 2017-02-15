"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var underscore_1 = require("underscore");
var alt_1 = require("../alt");
var StatsActions_1 = require("../actions/StatsActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var StatsStore = (function (_super) {
    __extends(StatsStore, _super);
    function StatsStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(StatsActions_1.default);
        _this.leadingRace = { race: 'Unknown', count: 0 };
        _this.leadingBloodline = { bloodline: 'Unknown', count: 0 };
        _this.amarrCount = 0;
        _this.caldariCount = 0;
        _this.gallenteCount = 0;
        _this.minmatarCount = 0;
        _this.totalVotes = 0;
        _this.femaleCount = 0;
        _this.maleCount = 0;
        _this.totalCount = 0;
        return _this;
    }
    StatsStore.prototype.onGetStatsSuccess = function (data) {
        underscore_1.assign(this, data);
    };
    StatsStore.prototype.onGetStatsFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    };
    return StatsStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(StatsStore);
