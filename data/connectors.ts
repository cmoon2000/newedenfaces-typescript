import * as Mongoose from 'mongoose';

import { ICharacterModel } from '../models/character';
const config: { database: string } = require('../config');

const connectionTwo = Mongoose.createConnection(config.database);
connectionTwo.on('error', function() {
	  console.info('Error From connectionTwo in file connectors.js: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

const CharacterSchema = new Mongoose.Schema({
	characterId: { type: String, unique: true, index: true },
	name: String,
	race: String,
	gender: String,
	bloodline: String,
	wins: { type: Number, default: 0 },
	losses: { type: Number, default: 0 },
	reports: { type: Number, default: 0 },
	random: { type: [Number], index: '2d' },
	voted: { type: Boolean, default: false }
});

const Character = Mongoose.model<ICharacterModel>('characters', CharacterSchema);

export default Character;