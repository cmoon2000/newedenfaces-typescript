"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var underscore_1 = require("underscore");
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var NavbarActions = (function (_super) {
    __extends(NavbarActions, _super);
    function NavbarActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('getCharacterCountSuccess', 'getCharacterCountFail', 'findCharacterSuccess', 'findCharacterFail');
        return _this;
    }
    NavbarActions.prototype.updateOnlineUsers = function (payload) {
        this.dispatch(payload);
    };
    NavbarActions.prototype.updateAjaxAnimation = function (className) {
        this.dispatch(className);
    };
    NavbarActions.prototype.updateSearchQuery = function (payload) {
        this.dispatch(payload);
    };
    NavbarActions.prototype.findCharacter = function (payload) {
        var _this = this;
        $.ajax({
            url: '/api/characters/search',
            data: { name: payload.searchQuery }
        })
            .done(function (data) {
            underscore_1.assign(payload, data);
            _this.actions.findCharacterSuccess(payload);
        })
            .fail(function () {
            _this.actions.findCharacterFail(payload);
        });
    };
    NavbarActions.prototype.getCharacterCount = function () {
        var _this = this;
        $.ajax({ url: '/api/characters/count' })
            .done(function (data) {
            _this.actions.getCharacterCountSuccess(data);
        })
            .fail(function (jqXhr) {
            _this.actions.getCharacterCountFail(jqXhr);
        });
    };
    return NavbarActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(NavbarActions);
