/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

const twoCharactersGraphqlString = `
{
  twoCharacters {
    characterId
    name
    race
    bloodline
    gender
    voted
    reports
    losses
    wins
  }
}
`;

class HomeActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'getTwoCharactersSuccess',
			'getTwoCharactersFail',
			'voteFail'
		);
	}

	getTwoCharacters() {
		$.ajax({
			url: '/api/characters',
			data: { requestString: twoCharactersGraphqlString }
		  })
		  .done((data: any) => this.actions.getTwoCharactersSuccess(data.data.twoCharacters))
		  .fail((jqXhr: any) => this.actions.getTwoCharactersFail(jqXhr.responseJSON.message));
	}

	vote(winner: string, loser: string) {
		$.ajax({
			type: 'PUT',
			url: '/api/characters',
			data: { winner: winner, loser: loser }
		})
			.done(() => this.actions.getTwoCharacters())
			.fail((jqXhr: any) => this.actions.voteFail(jqXhr.responseJSON.message));
	}
}

export default altInstance.createActions<HomeActions>(HomeActions);