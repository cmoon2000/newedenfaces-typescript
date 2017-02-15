/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import altInstance from '../alt';
import AddCharacterActions from '../actions/AddCharacterActions';
import AbstractStoreModel from './AbstractStoreModel';

// create an interface to model the "state" in this store

export interface AddCharacterState {
	name: string;
	gender: string;
	helpBlock: string;
	nameValidationState: string;
	genderValidationState: string;
	onAddCharacterSuccess(successMessage: string): void;
	onAddCharacterFail(errorMessage: string): void;
	onUpdateName(event: Event): void;
	onUpdateGender(event: Event): void;
	onInvalidName(): void;
	onInvalidGender(): void;
}

class AddCharacterStore extends AbstractStoreModel<AddCharacterState> implements AddCharacterState {
	name: string;
	gender: string;
	helpBlock: string;
	nameValidationState: string;
	genderValidationState: string;
	constructor() {
		super();
		this.bindActions(AddCharacterActions);
		this.name = '';
		this.gender = '';
		this.helpBlock = '';
		this.nameValidationState = '';
		this.genderValidationState = '';
	}

	onAddCharacterSuccess(successMessage: string) {
		this.nameValidationState = 'has-success';
		this.helpBlock = successMessage;
	}

	onAddCharacterFail(errorMessage: string) {
		this.nameValidationState = 'has-error';
		this.helpBlock = errorMessage;
	}

	onUpdateName(event: Event) {
		this.name = (event.target as HTMLInputElement).value;
		this.nameValidationState = '';
		this.helpBlock = '';
	}
	onUpdateGender(event: Event) {
		this.gender = (event.target as HTMLInputElement).value;
		this.genderValidationState = '';
	}
	onInvalidName() {
		this.nameValidationState = 'has-error';
		this.helpBlock = 'Please enter a character name.';
	}
	onInvalidGender() {
		this.genderValidationState = 'has-error';
	}
}

export default altInstance.createStore<AddCharacterStore>(AddCharacterStore);