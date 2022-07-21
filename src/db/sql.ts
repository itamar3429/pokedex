import { Pool } from "pg";

interface ICount {
	count: number;
}

interface IPokemon {
	id: number;
	name: string;
	img: [string, string];
	height: number;
	weight: number;
	specie: string;
}

let pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

async function query(queryString: string = "", queryParams: any[] = []) {
	return pool.query(queryString, queryParams);
}

export async function getPokemonsRange(offset: number = 0, limit: number = 50) {
	const [pokemons, count] = await Promise.all([
		query(`SELECT * FROM pokemons LIMIT $1 OFFSET $2`, [limit, offset]).then(
			(res) => res.rows as IPokemon[]
		),
		query("SELECT COUNT(*) as count FROM pokemons").then(
			(res) => (res.rows as ICount[])[0].count
		),
	]);
	return { pokemons, count };
}

export async function getPokemonById(id: string) {
	let response = await query(`SELECT * FROM pokemons WHERE id = $1`, [
		id,
	]).then((res) => res.rows[0] as IPokemon);
	return response;
}

export async function getPokemonsByName(
	name: string,
	offset: number = 0,
	limit: number = 50
) {
	const [pokemons, count] = await Promise.all([
		query(
			`SELECT * FROM pokemons WHERE name like $1 || '%' LIMIT $2 OFFSET $3`,
			[name, limit, offset]
		).then((res) => res.rows as IPokemon[]),
		query("SELECT COUNT(*) as count FROM pokemons").then(
			(res) => (res.rows as ICount[])[0].count
		),
	]);
	return { pokemons, count };
}
