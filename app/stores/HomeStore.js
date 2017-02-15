"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var HomeActions_1 = require("../actions/HomeActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var HomeStore = (function (_super) {
    __extends(HomeStore, _super);
    function HomeStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(HomeActions_1.default);
        _this.characters = [];
        return _this;
    }
    HomeStore.prototype.onGetTwoCharactersSuccess = function (data) {
        this.characters = data;
    };
    HomeStore.prototype.onGetTwoCharactersFail = function (errorMessage) {
        toastr.error(errorMessage);
    };
    HomeStore.prototype.onVoteFail = function (errorMessage) {
        toastr.error(errorMessage);
    };
    return HomeStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(HomeStore);
