/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import {assign, contains} from 'underscore';
import altInstance from '../alt';
import CharacterActions from '../actions/CharacterActions';
import AbstractStoreModel from './AbstractStoreModel';

// create an interface to model the "state" in this store

export interface CharacterState {
  characterId: number | string;
  name: string;
  race: string;
  bloodline: string;
  gender: string;
  wins: number;
  losses: number;
  winLossRatio: number | string;
  isReported: boolean;
  onGetCharacterSuccess(data: any): void;
  onGetCharacterFail(jqXhr: any): void;
  onReportSuccess(): void;
  onReportFail(jqXhr: any): void;
}

class CharacterStore extends AbstractStoreModel<CharacterState> implements CharacterState {
  characterId: number | string;
  name: string;
  race: string;
  bloodline: string;
  gender: string;
  wins: number;
  losses: number;
  winLossRatio: number | string;
  isReported: boolean;
  constructor() {
    super();
    this.bindActions(CharacterActions);
    this.characterId = 0;
    this.name = 'TBD';
    this.race = 'TBD';
    this.bloodline = 'TBD';
    this.gender = 'TBD';
    this.wins = 0;
    this.losses = 0;
    this.winLossRatio = 0;
    this.isReported = false;
  }

  onGetCharacterSuccess(data: any) {
    assign(this, data);
    $(document.body).attr('class', 'profile ' + this.race.toLowerCase());
    let localData = localStorage.getItem('NEF') ? JSON.parse((localStorage.getItem('NEF') as string)) : {};
    let reports = localData.reports || [];
    this.isReported = contains(reports, this.characterId);
    // If is NaN (from division by zero) then set it to "0"
    this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100) || 0).toFixed(1);
  }

  onGetCharacterFail(jqXhr: any) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onReportSuccess() {
    this.isReported = true;
    let localData = localStorage.getItem('NEF') ? JSON.parse((localStorage.getItem('NEF') as string)) : {};
    localData.reports = localData.reports || [];
    localData.reports.push(this.characterId);
    localStorage.setItem('NEF', JSON.stringify(localData));
    toastr.warning('Character has been reported.');
  }

  onReportFail(jqXhr: any) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default altInstance.createStore<CharacterState>(CharacterStore);