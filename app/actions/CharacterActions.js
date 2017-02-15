"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var CharacterActions = (function (_super) {
    __extends(CharacterActions, _super);
    function CharacterActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('reportSuccess', 'reportFail', 'getCharacterSuccess', 'getCharacterFail');
        return _this;
    }
    CharacterActions.prototype.getCharacter = function (characterId) {
        var _this = this;
        $.ajax({ url: '/api/characters/' + characterId })
            .done(function (data) {
            _this.actions.getCharacterSuccess(data);
        })
            .fail(function (jqXhr) {
            _this.actions.getCharacterFail(jqXhr);
        });
    };
    CharacterActions.prototype.report = function (characterId) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: '/api/report',
            data: { characterId: characterId }
        })
            .done(function () {
            _this.actions.reportSuccess();
        })
            .fail(function (jqXhr) {
            _this.actions.reportFail(jqXhr);
        });
    };
    return CharacterActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(CharacterActions);
