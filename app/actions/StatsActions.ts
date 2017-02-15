/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

class StatsActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'getStatsSuccess',
			'getStatsFail'
		);
	}

	getStats() {
		$.ajax({ url: '/api/stats' })
		  .done(data => this.actions.getStatsSuccess(data))
		  .fail(jqXhr => this.actions.getStatsFail(jqXhr));
	}
}

export default altInstance.createActions<StatsActions>(StatsActions);