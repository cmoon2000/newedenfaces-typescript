/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

class CharacterListActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'getCharactersSuccess',
			'getCharactersFail'
		);
	}

	getCharacters(payload: any) {
		interface ICharacter {
			race: string;
			bloodline: string;
			gender: string;
		}

		let url = '/api/characters/top';
		const params: ICharacter = <any>{
			race: payload.race,
			bloodline: payload.bloodline
		};

		if (payload.category === 'female') {
			params.gender = 'female';
		} else if (payload.category === 'male') {
			params.gender = 'male';
		}

		if (payload.category === 'shame') {
			url = '/api/characters/shame';
		}

		$.ajax({ url: url, data: params })
		  .done(data => this.actions.getCharactersSuccess(data))
		  .fail(jqXhr => this.actions.getCharactersFail(jqXhr));
	}
}

export default altInstance.createActions<CharacterListActions>(CharacterListActions);