/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import altInstance from '../alt';
import FooterActions from '../actions/FooterActions';
import AbstractStoreModel from './AbstractStoreModel';

// create an interface to model the "state" in this store

export interface FooterState {
	characters: Array<string>;
	onGetTopCharactersSuccess(data: any): void;
	onGetTopCharactersFail(jqXhr: any): void;
}

class FooterStore extends AbstractStoreModel<FooterState> implements FooterState {
	characters: Array<string>;
	constructor() {
		super();
		this.bindActions(FooterActions);
		this.characters = [];
	}

	onGetTopCharactersSuccess(data: any) {
		this.characters = data.slice(0, 5);
	}

	onGetTopCharactersFail(jqXhr: any) {
		// Handle multiple response formats, fallback to HTTP status code number.
		toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
	}
}

export default altInstance.createStore<FooterState>(FooterStore);