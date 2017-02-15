import * as React from 'react';
import {Link} from 'react-router';
import {first, without, findWhere} from 'underscore';
import HomeStore, { HomeState } from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import ICharacter from '../../models/ICharacter';

class Home extends React.Component<any, HomeState> {
	constructor(props: any) {
		super(props);
		this.state = HomeStore.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		HomeStore.listen(this.onChange);
		HomeActions.getTwoCharacters();
	}

	componentWillUnmount() {
		HomeStore.unlisten(this.onChange);
	}

	onChange(state: any) {
		this.setState(state);
	}

	handleClick(character: ICharacter) {
		const winner: string = character.characterId;
		const loser: string = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
		HomeActions.vote(winner, loser);
	}

	render() {
		const characterNodes = this.state.characters.map((character: ICharacter, index: number) => {
			return (
				<div key={character.characterId} className={index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5'}>
					<div className='thumbnail fadeInUp animated'>
						<img onClick={this.handleClick.bind(this, character)} src={'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg'}/>
						<div className='caption text-center'>
							<ul className='list-inline'>
								<li><strong>Race:</strong> {character.race}</li>
								<li><strong>Bloodline:</strong> {character.bloodline}</li>
							</ul>
							<h4>
								<Link to={'/characters/' + character.characterId}><strong>{character.name}</strong></Link>
							</h4>
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className='container'>
				<h3 className='text-center'>Click on the portrait. Select your favorite.</h3>
				<div className='row'>
					{characterNodes}
				</div>
			</div>
		);
	}
}

export default Home;