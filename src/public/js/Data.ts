// interface IPokemonList {
// 	name: string;
// 	url: string;
// }
let next = "";
export interface IPokemon {
	name: string;
	img: [string, string];
	specie: string;
	height: number;
	weight: number;
}

// Controls the pokemon api to retrieve data and parse it correctly.
export class Data {
	// Gets pokemons list and gets info forEach pokemon on the list.
	static getPokemonList(limit: number, page: number) {
		return fetch(`/api/pokemons?limit=${limit}&offset=${(page - 1) * limit}`)
			.then((res) => res.json())
			.then((data) => {
				next = data.next;
				return data.results;
			});
	}

	// Fetches all the existing pokemons and filters them by name, then fetches the info for the filtered pokemons
	static getPokemonByName(name: string, limit: number, page: number) {
		return fetch(
			`/api/pokemons/name/${encodeURIComponent(name)}/?limit=${limit}&offset=${
				(page - 1) * limit
			}`
		)
			.then((res) => res.json())
			.then((data) => {
				next = data.next;
				return data.results;
			});
	}

	static getNext() {
		console.log(next);

		return fetch(next)
			.then((res) => res.json())
			.then((data) => {
				next = data.next;
				console.log(next);
				console.log(data);

				return data.results;
			});
	}
}
