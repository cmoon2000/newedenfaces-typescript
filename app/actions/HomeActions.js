"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var HomeActions = (function (_super) {
    __extends(HomeActions, _super);
    function HomeActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('getTwoCharactersSuccess', 'getTwoCharactersFail', 'voteFail');
        return _this;
    }
    HomeActions.prototype.getTwoCharacters = function () {
        var _this = this;
        $.ajax({ url: '/api/characters' })
            .done(function (data) { return _this.actions.getTwoCharactersSuccess(data); })
            .fail(function (jqXhr) { return _this.actions.getTwoCharactersFail(jqXhr.responseJSON.message); });
    };
    HomeActions.prototype.vote = function (winner, loser) {
        var _this = this;
        $.ajax({
            type: 'PUT',
            url: '/api/characters',
            data: { winner: winner, loser: loser }
        })
            .done(function () { return _this.actions.getTwoCharacters(); })
            .fail(function (jqXhr) { return _this.actions.voteFail(jqXhr.responseJSON.message); });
    };
    return HomeActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(HomeActions);
