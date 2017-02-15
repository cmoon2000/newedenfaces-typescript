/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import altInstance from '../alt';
import CharacterListActions from '../actions/CharacterListActions';
import AbstractStoreModel from './AbstractStoreModel';
import ICharacter from '../../models/ICharacter';

export interface CharacterListState {
	characters: Array<ICharacter>;
	onGetCharactersSuccess(data: any): void;
	onGetCharactersFail(jqXhr: any): void;
}

class CharacterListStore extends AbstractStoreModel<CharacterListState> implements CharacterListState {
	characters: Array<ICharacter>;
	constructor() {
		super();
		this.bindActions(CharacterListActions);
		this.characters = [];
	}

	onGetCharactersSuccess(data: any) {
		this.characters = data;
	}

	onGetCharactersFail(jqXhr: any) {
		toastr.error(jqXhr.responseJSON.message);
	}
}

export default altInstance.createStore<CharacterListState>(CharacterListStore);