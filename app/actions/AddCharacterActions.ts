/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

const setCharacterGraphqlString = `
mutation Character(
	$characterId: String,
	$name: String,
	$race: String,
	$bloodline: String,
	$gender: String,
	$random: [Float]) {
  character(character: {
	  	characterId: $characterId,
	  	name: $name,
	  	race: $race,
	  	bloodline: $bloodline,
	  	gender: $gender,
	  	random: $random}) {
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

class AddCharacterActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'addCharacterSuccess',
			'addCharacterFail',
			// 'updateName',
			// 'updateGender',
			// 'invalidName',
			// 'invalidGender'
		);
	}

	invalidName() {
		this.dispatch();
	}

	invalidGender() {
		this.dispatch();
	}

	updateName(payload: any) {
		this.dispatch(payload);
	}

	updateGender(payload: any) {
		this.dispatch(payload);
	}

	addCharacter(name: string, gender: string) {
		$.ajax({
			type: 'POST',
			url: '/api/characters',
			data: { name: name, gender: gender, requestString: setCharacterGraphqlString }
		})
		  .done((data) => {
		  	this.actions.addCharacterSuccess(data.message);
		  })
		  .fail((jqXhr) => {
		 	this.actions.addCharacterFail(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);

		  });
	}
}

export default altInstance.createActions<AddCharacterActions>(AddCharacterActions);