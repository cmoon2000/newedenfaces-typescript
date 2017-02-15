/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import altInstance from '../alt';
import NavbarActions from '../actions/NavbarActions';
import AbstractStoreModel from './AbstractStoreModel';

// create an interface to model the "state" in this store

export interface NavbarState {
	totalCharacters: number;
	onlineUsers: number;
	searchQuery: string;
	ajaxAnimationClass: string;
	onFindCharacterSuccess(payload: any): void;
	onFindCharacterFail(payload: any): void;
	onUpdateOnlineUsers(data: any): void;
	onUpdateAjaxAnimation(className: string): void;
	onUpdateSearchQuery(event: Event): void;
	onGetCharacterCountSuccess(data: any): void;
	onGetCharacterCountFail(jqXhr: any): void;
}

class NavbarStore extends AbstractStoreModel<NavbarState> implements NavbarState {
	totalCharacters: number;
	onlineUsers: number;
	searchQuery: string;
	ajaxAnimationClass: string;

	constructor() {
		super();
		this.bindActions(NavbarActions);
		this.totalCharacters = 0;
		this.onlineUsers = 0;
		this.searchQuery = '';
		this.ajaxAnimationClass = '';
	}

	onFindCharacterSuccess(payload: any) {
		payload.history.push('/characters/' + payload.characterId);
	}
	onFindCharacterFail(payload: any) {
		payload.searchForm.classList.add('shake');
		setTimeout(() => {
			payload.searchForm.classList.remove('shake');
		}, 1000);
	}

	onUpdateOnlineUsers(data: any) {
		this.onlineUsers = data.onlineUsers;
	}

	onUpdateAjaxAnimation(className: string) {
		this.ajaxAnimationClass = className; // fadein or fadeout
	}

	onUpdateSearchQuery(event: Event) {
		this.searchQuery = (event.target as HTMLInputElement).value;
	}

	onGetCharacterCountSuccess(data: any) {
		this.totalCharacters = data.count;
	}

	onGetCharacterCountFail(jqXhr: any) {
		toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
	}
}

export default altInstance.createStore<NavbarState>(NavbarStore);