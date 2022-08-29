const { MongoClient } = require("mongodb");

const data = require("./dist/data").data;

let url =
	"mongodb+srv://{username}:{password}@{host}/?retryWrites=true&w=majority";

let client = new MongoClient(url);

async function run() {
	let pokedex = client.db("pokedex");
	let pokemons = pokedex.collection("pokemons");
	let pokArr = data.map((pok) => {
		pok.img = [pok.img];
		return pok;
	});

	let generated = [];

	for (let i = 0; i < pokArr.length; i++) {
		if (pokArr[i].id < 1000)
			generated.push(...generatePokemons(pokArr[i], pokArr));
	}

	// console.log(generated[20130]);

	await pokemons.insertMany(pokArr, {
		maxTimeMS: 99999,
	});

	while (generated.length) {
		console.log(generated.length);
		await pokemons.insertMany(generated.splice(0, 10000), {
			maxTimeMS: 99999,
		});
	}
}

function generatePokemons(pokemon, arr) {
	let newArr = [];

	arr.forEach((pok) => {
		if (pok.id != pokemon.id) {
			newArr.push(combinePokemons(pokemon, pok));
		}
	});
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

run().then(() => client.close());
