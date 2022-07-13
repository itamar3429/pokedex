const fs = require("fs");

const axios = require("axios").default;

// let data = [];
// if (false)
axios
	.get("https://pokeapi.co/api/v2/pokemon/?limit=1000000&offset=0")
	.then((res) => res.data)
	.then(async (data) => {
		let promises = [];
		let pokemons = [...data.results];
		// .map((pok, i) => {
		// 	pok.id = i + 1;
		// 	return pok;
		// });
		while (pokemons.length) {
			console.log(pokemons.length);

			promises.push(
				...(await Promise.all(
					pokemons
						.splice(0, 50)
						.map((pok) => axios.get(pok.url).then((res) => parseData(res.data)))
				))
			);
		}
		return promises;
	})
	.then((poks) => {
		let data = JSON.stringify(poks);
		fs.writeFileSync("./data.json", data, "utf-8");
		fs.writeFileSync("./src/data.ts", "export const data = " + data, "utf-8");
	})
	.then(() => console.log("done!"));

// function getAll() { // for request in dom
// 	return fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000000&offset=0').then(res => res.json())
// 		.then(data => Promise.all(data.results.map((pok, i) =>
// 			fetch(pok.url).then(res => res.json()).then(data => parseData(data, i))
// 		)))
// }

function parseData(data) {
	let p = {
		name: data.name,
		img: data?.sprites?.front_default || "",
		specie: data.types[0].type.name || "",
		height: Number(data.height) || 0,
		weight: Number(data.weight) || 0,
		id: data.id,
	};
	return p;
}

// const data = fs.readFileSync("./data.json", "utf-8").trim();
// fs.writeFileSync("./src/data.ts", "export const data = " + data, "utf-8");
