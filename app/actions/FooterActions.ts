/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

class FooterActions extends AbstractActions {
	// constructor() {
	// 	super();
	// 	// this.generateActions(
	// 	// 	'getTopCharacterSuccess',
	// 	// 	'getTopCharacterFail'
	// 	// );
	// }

	getTopCharacterSuccess(payload: any) {
		this.dispatch(payload);
	}

	getTopCharacterFail(payload: any) {
		this.dispatch(payload);
	}

	getTopCharacters() {
		$.ajax({ url: '/api/characters/top' })
		  .done((data) => {
		  	this.actions.getTopCharacterSuccess(data)
		  })
		  .fail((jqXhr) => {
		  	this.actions.getTopCharacterFail(jqXhr)
		  });
	}
}

export default altInstance.createActions<FooterActions>(FooterActions);