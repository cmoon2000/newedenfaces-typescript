"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var FooterActions_1 = require("../actions/FooterActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var FooterStore = (function (_super) {
    __extends(FooterStore, _super);
    function FooterStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(FooterActions_1.default);
        _this.characters = [];
        return _this;
    }
    FooterStore.prototype.onGetTopCharactersSuccess = function (data) {
        this.characters = data.slice(0, 5);
    };
    FooterStore.prototype.onGetTopCharactersFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    };
    return FooterStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(FooterStore);
