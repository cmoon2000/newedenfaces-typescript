import * as mongoose from 'mongoose';
import ICharacter from './ICharacter';

export interface ICharacterModel extends ICharacter, mongoose.Document {}

const characterSchema = new mongoose.Schema({
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

let Character = mongoose.model<ICharacterModel>('Character', characterSchema);
export default Character;