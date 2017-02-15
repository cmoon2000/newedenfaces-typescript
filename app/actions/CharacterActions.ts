/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

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
    $.ajax({ url: '/api/characters/' + characterId })
      .done((data) => {
        this.actions.getCharacterSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getCharacterFail(jqXhr);
      });
  }

  report(characterId: string) {
    $.ajax({
      type: 'POST',
      url: '/api/report',
      data: { characterId: characterId }
    })
      .done(() => {
        this.actions.reportSuccess();
      })
      .fail((jqXhr) => {
        this.actions.reportFail(jqXhr);
      });
  }
}

export default altInstance.createActions<CharacterActions>(CharacterActions);