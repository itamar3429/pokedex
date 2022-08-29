const data = require("../dist/data").data;
const { Pool } = require("pg");
const { FALSE } = require("sass");

let pool = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		"postgres://{username}:{password}@{host}:{port}/{database}",
	ssl: {
		rejectUnauthorized: false,
	},
});

async function run() {
	let pokArr = data.map((pok) => {
		pok.img = [pok.img];
		return pok;
	});

	let generated = [];

	for (let i = 0; i < pokArr.length; i++) {
		if (pokArr[i].id < 1000)
			generated.push(...generatePokemons(pokArr[i], pokArr));
	}

	console.log([...pokArr, ...generated].length);
	await pool.connect();
	initDB([...pokArr, ...generated]);
}

function generatePokemons(pokemon, arr) {
	let newArr = [];

	for (let i = 0; i < 8; i++) {
		let r = Math.floor(Math.random() * arr.length);
		r = i + 1;
		if (r == pokemon.id) r = 9;
		newArr.push(combinePokemons(pokemon, arr[r]));
	}
	// arr.forEach((pok) => {
	// 	if (pok.id != pokemon.id) {
	// 		newArr.push(combinePokemons(pokemon, pok));
	// 	}
	// });
	return newArr;
}

function combinePokemons(pok1, pok2) {
	// let random = Math.floor(Math.random() * 2);
	let pokemon = {
		name: pok1.name + "/" + pok2.name,
		img: [
			`https://raw.githubusercontent.com/Aegide/custom-fusion-sprites/main/CustomBattlers/${pok1.id}.${pok2.id}.png`,
			`https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/${pok1.id}/${pok1.id}.${pok2.id}.png`,
		],
		specie: pok1.specie,
		height: Math.floor((pok1.height + pok2.height) / 2),
		weight: Math.floor((pok1.weight + pok2.weight) / 2),
	};
	return pokemon;
}

async function query(queryString = "", queryParams = []) {
	return pool.query(queryString, queryParams);
}

async function initDB(pokArr = []) {
	await query("DROP TABLE IF EXISTS pokemons");
	await query(`
		CREATE TABLE pokemons (
			id SERIAL PRIMARY KEY,
			"name" VARCHAR(50) DEFAULT NULL,
			"img" TEXT[] default ARRAY[]::TEXT[],
			"specie" VARCHAR(50) DEFAULT NULL,
			"height" INTEGER DEFAULT NULL,
			weight INTEGER DEFAULT NULL
		)
	`);

	while (pokArr.length) {
		console.log(pokArr.length);
		// let curr = [
		// 	pokArr.splice(0, 50),
		// 	// pokArr.splice(0, 50),
		// 	// pokArr.splice(0, 50),
		// 	// pokArr.splice(0, 50),
		// 	// pokArr.splice(0, 50),
		// ].filter((x) => x.length);
		let curr = pokArr.splice(0, 250);
		await insertPokArr(curr);
	}
}

function insertPokArr(pokArr = []) {
	// [[1,2],[3],[4,[5],6]].flat() => [1,2,3,4,[5],6]
	let index = 1;
	let queryStr = `
	INSERT INTO pokemons(name, img, specie, height, weight)
	VALUES 
	${pokArr
		.map(
			(pok) =>
				`($${index++}, $${index++}, $${index++}, $${index++}, $${index++})`
		)
		.join(",\n")}
	`;
	let params = pokArr.map((pok) => [
		pok.name,
		pok.img,
		pok.specie,
		pok.height,
		pok.weight,
	]);
	return query(queryStr, params.flat());
}
run();
