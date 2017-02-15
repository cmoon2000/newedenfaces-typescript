"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var FooterActions = (function (_super) {
    __extends(FooterActions, _super);
    function FooterActions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FooterActions.prototype.getTopCharacterSuccess = function (payload) {
        this.dispatch(payload);
    };
    FooterActions.prototype.getTopCharacterFail = function (payload) {
        this.dispatch(payload);
    };
    FooterActions.prototype.getTopCharacters = function () {
        var _this = this;
        $.ajax({ url: '/api/characters/top' })
            .done(function (data) {
            _this.actions.getTopCharacterSuccess(data);
        })
            .fail(function (jqXhr) {
            _this.actions.getTopCharacterFail(jqXhr);
        });
    };
    return FooterActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(FooterActions);
