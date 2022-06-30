interface IPokemonList {
	name: string;
	url: string;
}

export interface IPokemon {
	name: string;
	img: string;
	specie: string;
	height: number;
	weight: number;
}

// Controls the pokemon api to retrieve data and parse it correctly.
export class Data {
	// Gets pokemons list and gets info forEach pokemon on the list.
	static getPokemonList(limit: number, page: number) {
		return this.getPokemons(limit, (page - 1) * limit).then((data) => {
			let list = data as IPokemonList[];
			return Promise.all(this.fetchPokemonsFromArray(list));
		});
	}

	// Fetches all the existing pokemons and filters them by name, then fetches the info for the filtered pokemons
	static getPokemonByName(name: string, limit: number, page: number) {
		return this.getPokemons(10000, 0).then((data) => {
			let list = data as IPokemonList[];
			return Promise.all(
				this.fetchPokemonsFromArray(
					list
						.filter((p) => p.name.includes(name))
						.slice((page - 1) * limit, (page - 1) * limit + limit)
				)
			);
		});
	}

	// Gets a list of pokemon names and url and filters by offset and limit.
	static getPokemons(limit: number, offset: number) {
		let pokemonsStorage = localStorage.getItem("pokemons");
		if (pokemonsStorage)
			return this.getRange(JSON.parse(pokemonsStorage), limit, offset);
		return fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1000000&offset=0`)
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("pokemons", JSON.stringify(data.results));
				return this.getRange(data.results, limit, offset);
			});
	}

	// Filters array by offset and limit
	static async getRange(arr: any[], limit: number, offset: number) {
		return arr.slice(offset, offset + limit);
	}

	// Gets pokemonArr and returns an array with the fetch promise of each pokemon url
	static fetchPokemonsFromArray(pokemonArr: IPokemonList[]) {
		return pokemonArr.map((pokemon) => {
			let localS = localStorage.getItem(pokemon.url) as string;
			if (localS) return JSON.parse(localS);
			return fetch(pokemon.url)
				.then((res) => res.json())
				.then((data) => {
					return this.parseData(data, pokemon.url);
				})
				.catch(console.log);
		});
	}

	// Parses the data needed to save in localStorage and returns it.
	static parseData(data: any, url: string) {
		let p: IPokemon = {
			name: data.name,
			img: data?.sprites?.front_default || "",
			specie: data.types[0].type.name || "",
			height: Number(data.height) || 0,
			weight: Number(data.weight) || 0,
		};
		localStorage.setItem(url, JSON.stringify(p));
		return p;
	}
}
