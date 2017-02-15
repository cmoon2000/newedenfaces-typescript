interface ICharacter {
	characterId: string;
	name: string;
	race: string;
	gender: string;
	bloodline: string;
	wins: number;
	losses: number;
	reports: number;
	random: Array<number>;
	voted: boolean;
}

export default ICharacter;