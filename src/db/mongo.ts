import { MongoClient, Collection } from "mongodb";

import { IPokemon } from "../public/js/Data";
const uri =
	"mongodb+srv://Cyber4s:ilovecode@trymongo.rz12m.mongodb.net/?retryWrites=true&w=majority";
export const client = new MongoClient(uri);

export async function create() {
	await client.connect();
}

export function connect(dbName: string, collectionName: string) {
	const db = client.db(dbName);
	const collection: Collection<IPokemon> = db.collection(collectionName);
	return collection;
}

export async function getPokemonsRange(from: number = 0, limit: number = 50) {
	let pokemos = connect("pokedex", "pokemons");
	let response = await pokemos.find().skip(from).limit(limit).toArray();
	return response;
}

export async function getPokemonsByName(
	name: string,
	from: number = 0,
	limit: number = 50
) {
	let pokemos = connect("pokedex", "pokemons");
	let response = await pokemos
		.find({ name: new RegExp(`^${name}.*`, "i") })
		.skip(from)
		.limit(limit)
		.toArray();
	let count = await pokemos.count({ name: new RegExp(`^${name}.*`, "i") });
	return { response, count };
}
