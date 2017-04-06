/// <reference path="../../node_modules/@types/toastr/index.d.ts"  />
import {assign} from 'underscore';
import altInstance from '../alt';
import StatsActions from '../actions/StatsActions';
import AbstractStoreModel from './AbstractStoreModel';

export interface StatsState {
	leadingRace: { topType: string, count: number };
	leadingBloodline: { topType: string, count: number };
	amarrCount: number;
	caldariCount: number;
	gallenteCount: number;
	minmatarCount: number;
	totalVotes: number;
	femaleCount: number;
	maleCount: number;
	totalCount: number;
	onGetStatsSuccess(data: any): void;
	onGetStatsFail(jqXhr: any): void;
}
class StatsStore extends AbstractStoreModel<StatsState> implements StatsState {
	leadingRace: { topType: string, count: number };
	leadingBloodline: { topType: string, count: number };
	amarrCount: number;
	caldariCount: number;
	gallenteCount: number;
	minmatarCount: number;
	totalVotes: number;
	femaleCount: number;
	maleCount: number;
	totalCount: number;
	constructor() {
		super();
		this.bindActions(StatsActions);
		this.leadingRace = { topType: 'Unknown', count: 0 };
		this.leadingBloodline = { topType: 'Unknown', count: 0 };
		this.amarrCount = 0;
		this.caldariCount = 0;
		this.gallenteCount = 0;
		this.minmatarCount = 0;
		this.totalVotes = 0;
		this.femaleCount = 0;
		this.maleCount = 0;
		this.totalCount = 0;
	}

	onGetStatsSuccess(data: any) {
		assign(this, data);
	}

	onGetStatsFail(jqXhr: any) {
		toastr.error(jqXhr.responseJSON.message);
	}
}

export default altInstance.createStore<StatsState>(StatsStore);