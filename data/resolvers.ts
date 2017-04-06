import * as _ from 'underscore';

import Character from './connectors';
import { ICharacterModel } from '../models/character';

const resolvers = {
	Query: {
		character(_: any, args: any) {
			const name = new RegExp(args.name, 'i');
			return Character
				.findOne({ name });
		},
		twoCharacters() {
			const choices = ["Female", "Male"];
			const randomGender = _.sample(choices);

			return Character.find({ random: { $near: [Math.random(), 0] } })
				.where('voted', false)
				.where('gender', randomGender)
				.limit(2)
				.exec()
				.then(characters => {
					if (characters.length === 2) {
						return characters;
					}

					const oppositeGender = _.first(_.without(choices, randomGender));

					return Character
						.find({ random: { $near: [Math.random(), 0] } })
						.where('voted', false)
						.where('gender', oppositeGender)
						.limit(2)
						.exec()
						.then(characters => {
							if (characters.length === 2) {
								return characters;
							}

							return Character
								.update({}, { $set: { voted: false } }, { multi: true })
								.exec()
								.then(() => []) // return empty array
								.catch(err => err);
						})
						.catch(err => err);
				}).catch(err => err);
		},
		count() {
			return Character.count({})
				.then(count => count)
				.catch(err => err);
		},
		top(_foo: any, args: any) {
			const params = args.params;
			const conditions: any = {};

			_.each(params, function(value, key) {
				conditions[key] = new RegExp('^' + value + '$', 'i');
			});

			return Character
				.find(conditions)
				.sort('-wins') // Sort in descending order (highest wins on top)
				.limit(100)
				.exec()
				.then(characters => {
					// Sort by winning percentage
					characters.sort(function(a: ICharacterModel, b: ICharacterModel) {
						if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) { return 1; }
						if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) { return -1; }
						return 0;
					});

					return characters;
				})
				.catch(err => err);
		},
		shame() {
			return Character
				.find()
				.sort('-losses')
				.limit(100)
				.exec()
				.then(characters => characters)
				.catch(err => err);
		},
		characterById(_foo: any, args: any) {
			const id: string = args.id;

			return Character
				.findOne({ characterId: id })
				.then(character => character)
				.catch(err => err);
		},
		stats() {
			return Promise.all([
				Character.count({}),
				Character.count({ race: 'Amarr' }),
				Character.count({ race: 'Caldari' }),
				Character.count({ race: 'Gallente' }),
				Character.count({ race: 'Minmatar' }),
				Character.count({ gender: 'Male' }),
				Character.count({ gender: 'Female' }),
				Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } })
					.then(totalVotes => {
						return totalVotes.length ? (<any>totalVotes[0]).total : 0;
					}),
				Character
					.find()
					.sort('-wins')
					.limit(100)
					.select('race')
					.exec()
					.then((characters) => {
						const raceCount = _.countBy(characters, character => (character as any).race);
						const max = _.max(raceCount, race => race);
						const inverted = _.invert(raceCount);
						const topRace = inverted[max];
						const topCount = raceCount[topRace];

						return { topType: topRace, count: topCount };
					}),
				Character
					.find()
					.sort('-wins')
					.limit(100)
					.select('bloodline')
					.exec()
					.then(characters => {
						const bloodlineCount = _.countBy(characters, character => (character as any).bloodline);
						const max = _.max(bloodlineCount, bloodline => bloodline);
						const inverted = _.invert(bloodlineCount);
						const topBloodline = inverted[max];
						const topCount = bloodlineCount[topBloodline];

						return { topType: topBloodline, count: topCount };
					})
			]).then(results => ({
				totalCount: results[0],
				amarrCount: results[1],
				caldariCount: results[2],
				gallenteCount: results[3],
				minmatarCount: results[4],
				maleCount: results[5],
				femaleCount: results[6],
				totalVotes: results[7],
				leadingRace: results[8],
				leadingBloodline: results[9]
			}))
			.catch(err => err);
		}
	},
	Mutation: {
		character(_root: any, args: any) {
			const character = new Character(args.character);
			return character
				.save()
				.then(character => character)
				.catch(err => err);
		},
		report(_foo: any, args: any) {
			return Character
				.findOne({ characterId: args.id })
				.then((character) => {
					if (!character) {
						return character;
					}

					character.reports++;

					if(character.reports > 4) {
						character.remove();
						return character;
					}

					return character.save().then(character => character);
				})
				.catch(err => err);
		}
	}
};

export default resolvers;