const fs = require('fs')

const axios = require('axios')



let data = [];

axios.default('https://pokeapi.co/api/v2/pokemon/?limit=1000000&offset=0').then(res => res.data).then(data => {
	console.log(data.results);

	return Promise.all(data.results.map(pok => axios.default(pok.url).then(res => res.data)))
}).then((poks) => fs.writeFileSync('./src/data.json')).then(() => console.log('done!'))

function getAll() {
	return fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000000&offset=0').then(res => res.json())
		.then(data => Promise.all(data.results.map((pok, i) =>
			fetch(pok.url).then(res => res.json()).then(data => parseData(data, i))
		)))
}

function parseData(data, index) {
	let p = {
		name: data.name,
		img: data ? .sprites ? .front_default || "",
		specie: data.types[0].type.name || "",
		height: Number(data.height) || 0,
		weight: Number(data.weight) || 0,
		id: index + 1
	};
	return p;
}