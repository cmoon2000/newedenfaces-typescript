/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import altInstance from '../alt';
import HomeActions from '../actions/HomeActions';
import AbstractStoreModel from './AbstractStoreModel';

export interface HomeState {
	characters: Array<any>;
	onGetTwoCharactersSuccess(data: any): void; 
	onGetTwoCharactersFail(errorMessage: any): void; 
	onVoteFail(errorMessage: any): void;
}

class HomeStore extends AbstractStoreModel<HomeState> implements HomeState {
	characters: Array<any>;
	constructor() {
		super();
		this.bindActions(HomeActions);
		this.characters = [];
	}

	onGetTwoCharactersSuccess(data: any) {
		this.characters = data;
	}
	onGetTwoCharactersFail(errorMessage: any) {
		toastr.error(errorMessage);
	} 
	onVoteFail(errorMessage: any) {
		toastr.error(errorMessage);
	}
}

export default altInstance.createStore<HomeState>(HomeStore)