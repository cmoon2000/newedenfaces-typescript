/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

const characterByIdGraphqlString = `
query CharacterById($id: String) {
  characterById(id: $id) {
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

const reportGraphqlString = `
mutation Report($id: String) {
  report(id: $id) {
    name
    reports
  }
}
`;

class CharacterActions extends AbstractActions {
  constructor() {
    super();
    this.generateActions(
      'reportSuccess',
      'reportFail',
      'getCharacterSuccess',
      'getCharacterFail'
    );
  }

  getCharacter(characterId: string) {
    $.ajax({
      url: '/api/characters/' + characterId,
      data: {
        requestString: characterByIdGraphqlString
      }
    })
      .done(data => {
        this.actions.getCharacterSuccess(data.data.characterById);
      })
      .fail((jqXhr) => {
        this.actions.getCharacterFail(jqXhr);
      });
  }

  report(characterId: string) {
    $.ajax({
      type: 'POST',
      url: '/api/report',
      data: { characterId: characterId, requestString: reportGraphqlString }
    })
      .done((data) => {
        console.log(data);
        this.actions.reportSuccess();
      })
      .fail((jqXhr) => {
        this.actions.reportFail(jqXhr);
      });
  }
}

export default altInstance.createActions<CharacterActions>(CharacterActions);