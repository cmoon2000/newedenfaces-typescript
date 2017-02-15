"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var alt_1 = require("../alt");
var AddCharacterActions_1 = require("../actions/AddCharacterActions");
var AbstractStoreModel_1 = require("./AbstractStoreModel");
var AddCharacterStore = (function (_super) {
    __extends(AddCharacterStore, _super);
    function AddCharacterStore() {
        var _this = _super.call(this) || this;
        _this.bindActions(AddCharacterActions_1.default);
        _this.name = '';
        _this.gender = '';
        _this.helpBlock = '';
        _this.nameValidationState = '';
        _this.genderValidationState = '';
        return _this;
    }
    AddCharacterStore.prototype.onAddCharacterSuccess = function (successMessage) {
        this.nameValidationState = 'has-success';
        this.helpBlock = successMessage;
    };
    AddCharacterStore.prototype.onAddCharacterFail = function (errorMessage) {
        this.nameValidationState = 'has-error';
        this.helpBlock = errorMessage;
    };
    AddCharacterStore.prototype.onUpdateName = function (event) {
        this.name = event.target.value;
        this.nameValidationState = '';
        this.helpBlock = '';
    };
    AddCharacterStore.prototype.onUpdateGender = function (event) {
        this.gender = event.target.value;
        this.genderValidationState = '';
    };
    AddCharacterStore.prototype.onInvalidName = function () {
        this.nameValidationState = 'has-error';
        this.helpBlock = 'Please enter a character name.';
    };
    AddCharacterStore.prototype.onInvalidGender = function () {
        this.genderValidationState = 'has-error';
    };
    return AddCharacterStore;
}(AbstractStoreModel_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = alt_1.default.createStore(AddCharacterStore);
