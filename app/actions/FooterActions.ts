/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';
import { topGraphqlString } from './CharacterListActions';

class FooterActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'getTopCharactersSuccess',
			'getTopCharactersFail'
		);
	}

	// getTopCharactersSuccess(payload: any) {
	// 	this.dispatch(payload);
	// }

	// getTopCharactersFail(payload: any) {
	// 	this.dispatch(payload);
	// }

	getTopCharacters() {
		$.ajax({
			url: '/api/characters/top',
			data: {
				requestString: topGraphqlString
			}
		})
		.done((data) => {
			this.actions.getTopCharactersSuccess(data.data.top)
		})
		.fail((jqXhr) => {
			this.actions.getTopCharactersFail(jqXhr)
		});
	}
}

export default altInstance.createActions<FooterActions>(FooterActions);