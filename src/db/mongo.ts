import { MongoClient, Collection, ObjectId } from "mongodb";

import { IPokemon } from "../public/js/Data";
const uri = process.env.MONGO_DB_URL as string;
console.log(uri);

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
	let count = await pokemos.countDocuments();
	return { pokemons: response, count };
}

export async function getPokemonById(id: string) {
	let pokemos = connect("pokedex", "pokemons");
	let response = await pokemos.findOne({ _id: new ObjectId(id) });
	return response;
}

export async function getPokemonsByName(
	name: string,
	from: number = 0,
	limit: number = 50
) {
	let pokemons = connect("pokedex", "pokemons");
	let response = await pokemons
		.find({ name: new RegExp(`^(${name}).*`, "i") })
		.skip(from)
		.limit(limit)
		.toArray();
	let count = await pokemons.countDocuments({
		name: new RegExp(`^${name}.*`, "i"),
	});
	return { response, count };
}
