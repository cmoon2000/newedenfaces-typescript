"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var underscore_1 = require("underscore");
var alt_1 = require("../alt");
var CharacterActions_1 = require("../actions/CharacterActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var CharacterStore = (function (_super) {
    __extends(CharacterStore, _super);
    function CharacterStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(CharacterActions_1.default);
        _this.characterId = 0;
        _this.name = 'TBD';
        _this.race = 'TBD';
        _this.bloodline = 'TBD';
        _this.gender = 'TBD';
        _this.wins = 0;
        _this.losses = 0;
        _this.winLossRatio = 0;
        _this.isReported = false;
        return _this;
    }
    CharacterStore.prototype.onGetCharacterSuccess = function (data) {
        underscore_1.assign(this, data);
        $(document.body).attr('class', 'profile ' + this.race.toLowerCase());
        var localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        var reports = localData.reports || [];
        this.isReported = underscore_1.contains(reports, this.characterId);
        this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100) || 0).toFixed(1);
    };
    CharacterStore.prototype.onGetCharacterFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    };
    CharacterStore.prototype.onReportSuccess = function () {
        this.isReported = true;
        var localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        localData.reports = localData.reports || [];
        localData.reports.push(this.characterId);
        localStorage.setItem('NEF', JSON.stringify(localData));
        toastr.warning('Character has been reported.');
    };
    CharacterStore.prototype.onReportFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    };
    return CharacterStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(CharacterStore);
