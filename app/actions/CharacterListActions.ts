/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

export const topGraphqlString = `
query GetTOP($params: ParamsTop) {
  top(params: $params) {
    characterId
    name
    race
    bloodline
    gender
    random
    voted
    reports
    losses
    wins
  }
}
`;

const shameGraphqlString = `
{
  shame {
    characterId
    name
    race
    bloodline
    gender
    random
    voted
    reports
    losses
    wins
  }
}
`;

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
		let requestString = topGraphqlString;
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
			requestString = shameGraphqlString;
		}

		$.ajax({
			url: url,
			data: {
				requestString,
				variables: {
					params
				}
			}
		})
		.done(data => this.actions.getCharactersSuccess(data.data.top || data.data.shame))
		.fail(jqXhr => this.actions.getCharactersFail(jqXhr));
	}
}

export default altInstance.createActions<CharacterListActions>(CharacterListActions);