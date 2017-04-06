/// <reference path="../../node_modules/@types/jquery/index.d.ts"  />
import altInstance from '../alt';
import AbstractActions from './AbstractActions';

const statsGraphqlString = `
{
  stats {
    totalCount
    amarrCount
    caldariCount
    gallenteCount
    minmatarCount
    maleCount
    femaleCount
    totalVotes
    leadingRace {
      topType
      count
    }
    leadingBloodline {
      topType
      count
    }
  }
}
`;

class StatsActions extends AbstractActions {
	constructor() {
		super();
		this.generateActions(
			'getStatsSuccess',
			'getStatsFail'
		);
	}

	getStats() {
		$.ajax({ url: '/api/stats', data: { requestString: statsGraphqlString } })
		  .done(data => this.actions.getStatsSuccess(data.data.stats))
		  .fail(jqXhr => this.actions.getStatsFail(jqXhr));
	}
}

export default altInstance.createActions<StatsActions>(StatsActions);