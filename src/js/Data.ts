interface IPokemonList {
	name: string;
	url: string;
}

export class Data {
	static getPokemonList(limit: number, page: number) {
		return fetch(
			`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${
				(page - 1) * limit
			}`
		)
			.then((response) => response.json())
			.then((data) => {
				let list = data.results as IPokemonList[];
				return Promise.all(
					list.map((pokemon) => {
						return fetch(pokemon.url).then((res) => res.json());
					})
				);
			});
	}

	// getFilteredPokemonList() {}

	static getPokemonByName(name: string) {
		return fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${10000}`)
			.then((response) => response.json())
			.then((data) => {
				let list = data.results as IPokemonList[];
				return Promise.all(
					list
						.filter((p) => p.name.includes(name))
						.slice(0, 50)
						.map((pokemon) => {
							return fetch(pokemon.url).then((res) => res.json());
						})
				);
			});
	}

	// getPokemonByID(id: string) {}
}
