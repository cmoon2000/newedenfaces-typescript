"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var CharacterListActions = (function (_super) {
    __extends(CharacterListActions, _super);
    function CharacterListActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('getCharactersSuccess', 'getCharactersFail');
        return _this;
    }
    CharacterListActions.prototype.getCharacters = function (payload) {
        var _this = this;
        var url = '/api/characters/top';
        var params = {
            race: payload.race,
            bloodline: payload.bloodline
        };
        if (payload.category === 'female') {
            params.gender = 'female';
        }
        else if (payload.category === 'male') {
            params.gender = 'male';
        }
        if (payload.category === 'shame') {
            url = '/api/characters/shame';
        }
        $.ajax({ url: url, data: params })
            .done(function (data) { return _this.actions.getCharactersSuccess(data); })
            .fail(function (jqXhr) { return _this.actions.getCharactersFail(jqXhr); });
    };
    return CharacterListActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(CharacterListActions);
