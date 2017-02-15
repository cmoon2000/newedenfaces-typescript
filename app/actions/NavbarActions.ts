/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import { assign } from 'underscore';
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

class NavbarActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			// 'updateOnlineUsers',
			// 'updateAjaxAnimation',
			// 'updateSearchQuery',
			'getCharacterCountSuccess',
			'getCharacterCountFail',
			'findCharacterSuccess',
			'findCharacterFail'
		);
	}

	updateOnlineUsers(payload: any) {
		this.dispatch(payload);
	}

	updateAjaxAnimation(className: string) {
		this.dispatch(className);
	}

	updateSearchQuery(payload: any) {
		this.dispatch(payload);
	}

	findCharacter(payload: any) {
		$.ajax({
			url: '/api/characters/search',
			data: { name: payload.searchQuery }
		})
		  .done((data) => {
		  	assign(payload, data);
		  	this.actions.findCharacterSuccess(payload);
		  })
		  .fail(() => {
		  	this.actions.findCharacterFail(payload);
		  });
	}

	getCharacterCount() {
		$.ajax({ url: '/api/characters/count' })
		  .done((data) => {
			this.actions.getCharacterCountSuccess(data);
		  })
		  .fail((jqXhr) => {
		  	this.actions.getCharacterCountFail(jqXhr);
		  });
	}
}

export default altInstance.createActions<NavbarActions>(NavbarActions);