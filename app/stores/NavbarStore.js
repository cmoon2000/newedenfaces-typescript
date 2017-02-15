"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var NavbarActions_1 = require("../actions/NavbarActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var NavbarStore = (function (_super) {
    __extends(NavbarStore, _super);
    function NavbarStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(NavbarActions_1.default);
        _this.totalCharacters = 0;
        _this.onlineUsers = 0;
        _this.searchQuery = '';
        _this.ajaxAnimationClass = '';
        return _this;
    }
    NavbarStore.prototype.onFindCharacterSuccess = function (payload) {
        payload.history.push('/characters/' + payload.characterId);
    };
    NavbarStore.prototype.onFindCharacterFail = function (payload) {
        payload.searchForm.classList.add('shake');
        setTimeout(function () {
            payload.searchForm.classList.remove('shake');
        }, 1000);
    };
    NavbarStore.prototype.onUpdateOnlineUsers = function (data) {
        this.onlineUsers = data.onlineUsers;
    };
    NavbarStore.prototype.onUpdateAjaxAnimation = function (className) {
        this.ajaxAnimationClass = className;
    };
    NavbarStore.prototype.onUpdateSearchQuery = function (event) {
        this.searchQuery = event.target.value;
    };
    NavbarStore.prototype.onGetCharacterCountSuccess = function (data) {
        this.totalCharacters = data.count;
    };
    NavbarStore.prototype.onGetCharacterCountFail = function (jqXhr) {
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    };
    return NavbarStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(NavbarStore);
