"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AbstractActions_1 = require("./AbstractActions");
var AddCharacterActions = (function (_super) {
    __extends(AddCharacterActions, _super);
    function AddCharacterActions() {
        var _this = _super.call(this) || this;
        _this.generateActions('addCharacterSuccess', 'addCharacterFail');
        return _this;
    }
    AddCharacterActions.prototype.invalidName = function () {
        this.dispatch();
    };
    AddCharacterActions.prototype.invalidGender = function () {
        this.dispatch();
    };
    AddCharacterActions.prototype.updateName = function (payload) {
        this.dispatch(payload);
    };
    AddCharacterActions.prototype.updateGender = function (payload) {
        this.dispatch(payload);
    };
    AddCharacterActions.prototype.addCharacter = function (name, gender) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: '/api/characters',
            data: { name: name, gender: gender }
        })
            .done(function (data) {
            _this.actions.addCharacterSuccess(data.message);
        })
            .fail(function (jqXhr) {
            _this.actions.addCharacterFail(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        });
    };
    return AddCharacterActions;
}(AbstractActions_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createActions(AddCharacterActions);
