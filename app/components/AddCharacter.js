"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AddCharacterStore_1 = require("../stores/AddCharacterStore");
var AddCharacterActions_1 = require("../actions/AddCharacterActions");
var AddCharacter = (function (_super) {
    __extends(AddCharacter, _super);
    function AddCharacter(props) {
        var _this = _super.call(this, props) || this;
        _this.state = AddCharacterStore_1.default.getState();
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    AddCharacter.prototype.componentDidMount = function () {
        AddCharacterStore_1.default.listen(this.onChange);
    };
    AddCharacter.prototype.componentWillUnmount = function () {
        AddCharacterStore_1.default.unlisten(this.onChange);
    };
    AddCharacter.prototype.onChange = function (state) {
        this.setState(state);
    };
    AddCharacter.prototype.handleSubmit = function (event, _fooEvent) {
        event.preventDefault();
        var name = this.state.name.trim();
        var gender = this.state.gender;
        if (!name) {
            AddCharacterActions_1.default.invalidName();
            this.refs.nameTextField.getDOMNode().focus();
        }
        if (!gender) {
            AddCharacterActions_1.default.invalidGender();
        }
        if (name && gender) {
            AddCharacterActions_1.default.addCharacter(name, gender);
        }
    };
    AddCharacter.prototype.render = function () {
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'row flipInX animated' },
                React.createElement("div", { className: 'col-sm-8' },
                    React.createElement("div", { className: 'panel panel-default' },
                        React.createElement("div", { className: 'panel-heading' }, "Add Character"),
                        React.createElement("div", { className: 'panel-body' },
                            React.createElement("form", { onSubmit: this.handleSubmit.bind(this) },
                                React.createElement("div", { className: 'form-group ' + this.state.nameValidationState },
                                    React.createElement("label", { className: 'control-label' }, "Character Name"),
                                    React.createElement("input", { type: 'text', className: 'form-control', ref: 'nameTextField', value: this.state.name, onChange: AddCharacterActions_1.default.updateName, autoFocus: true }),
                                    React.createElement("span", { className: 'help-block' }, this.state.helpBlock)),
                                React.createElement("div", { className: 'form-group ' + this.state.genderValidationState },
                                    React.createElement("div", { className: 'radio radio-inline' },
                                        React.createElement("input", { type: 'radio', name: 'gender', id: 'female', value: 'Female', checked: this.state.gender === 'Female', onChange: AddCharacterActions_1.default.updateGender }),
                                        React.createElement("label", { htmlFor: 'female' }, "Female")),
                                    React.createElement("div", { className: 'radio radio-inline' },
                                        React.createElement("input", { type: 'radio', name: 'gender', id: 'male', value: 'Male', checked: this.state.gender === 'Male', onChange: AddCharacterActions_1.default.updateGender }),
                                        React.createElement("label", { htmlFor: 'male' }, "Male"))),
                                React.createElement("button", { type: 'submit', className: 'btn btn-primary' }, "Submit"))))))));
    };
    return AddCharacter;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddCharacter;
