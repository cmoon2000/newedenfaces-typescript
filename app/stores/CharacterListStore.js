"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var CharacterListActions_1 = require("../actions/CharacterListActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var CharacterListStore = (function (_super) {
    __extends(CharacterListStore, _super);
    function CharacterListStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(CharacterListActions_1.default);
        _this.characters = [];
        return _this;
    }
    CharacterListStore.prototype.onGetCharactersSuccess = function (data) {
        this.characters = data;
    };
    CharacterListStore.prototype.onGetCharactersFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    };
    return CharacterListStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(CharacterListStore);
