interface IPokemonList {
	name: string;
	url: string;
}

// Controls the pokemon api to retrieve data and parse it correctly.
export class Data {
	// Gets pokemons list and gets info forEach pokemon on the list.
	static getPokemonList(limit: number, page: number) {
		return fetch(
			`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${
				(page - 1) * limit
			}`
		)
			.then((response) => response.json())
			.then((data) => {
				let list = data.results as IPokemonList[];
				return Promise.all(this.fetchPokemonsFromArray(list));
			});
	}

	// Fetches all the existing pokemons and filters them by name, then fetches the info for the filtered pokemons
	static getPokemonByName(name: string, limit: number, page: number) {
		return fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${10000}`)
			.then((response) => response.json())
			.then((data) => {
				let list = data.results as IPokemonList[];
				return Promise.all(
					this.fetchPokemonsFromArray(
						list
							.filter((p) => p.name.includes(name))
							.slice((page - 1) * limit, (page - 1) * limit + limit)
					)
				);
			});
	}

	// Gets pokemonArr and returns an array with the fetch promise of each pokemon url
	static fetchPokemonsFromArray(pokemonArr: any[]) {
		return pokemonArr.map((pokemon) => {
			return fetch(pokemon.url)
				.then((res) => res.json())
				.catch(console.log);
		});
	}
}
