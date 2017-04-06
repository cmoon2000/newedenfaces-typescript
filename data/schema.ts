const schema = `
type Character {
	characterId: String
	name: String
	race: String
	bloodline: String
	gender: String
	random: [Float]
	voted: Boolean
	reports: Int
	losses: Int
	wins: Int
}

input ParamsTop {
	race: String
	bloodline: String
}

type TopType {
  topType: String
  count: Int
}

type StatsResult {
	totalCount: Int
	amarrCount: Int
	caldariCount: Int
	gallenteCount: Int
	minmatarCount: Int
	maleCount: Int
	femaleCount: Int
	totalVotes: Int
	leadingRace: TopType
	leadingBloodline: TopType
}

type Query {
	character(name: String): Character

	# Returns 2 random characters of the same gender that have not been voted yet.
	twoCharacters: [Character]

	#Returns the total number of characters.
	count: Int

	#Return 100 highest ranked characters. Filter by gender, race and bloodline.
	top(params: ParamsTop): [Character]

	#Returns 100 lowest ranked characters.
	shame: [Character]

	characterById(id: String): Character

	# Returns characters statistics.
	stats: StatsResult
}

input CharacterInput {
	characterId: String
	name: String
	race: String
	bloodline: String
	gender: String
	random: [Float]
}

type Mutation {
	# Create a new character
	character(character: CharacterInput): Character

	report(id: String): Character
}

schema {
	query: Query
	mutation: Mutation
}
`;

export default schema;