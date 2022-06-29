import { Pokemons } from "./components/Pokemon";
import { Data } from "./Data";

class Module {
	async load() {
		let pokemonList = await Data.getPokemonList(50, 1);
		let parent = document.getElementById("list-container") as HTMLDivElement;
		Pokemons.render(pokemonList, parent, false);
		// console.log(pokemonList);

		let searchBar = document.getElementById("search-form")!;
		searchBar.addEventListener("submit", (e) => {
			e.preventDefault();
			let input = document.getElementById("search-input") as HTMLInputElement;

			let value = input.value;
			if (value)
				Data.getPokemonByName(value)
					.then((data) => {
						Pokemons.render(data, parent, false);
					})
					.catch(console.log);
			else {
				Pokemons.render(pokemonList, parent, false);
			}
		});
		let input = document.getElementById("search-input") as HTMLInputElement;
		input.addEventListener("input", (e) => {
			e.preventDefault();
			let value = input.value;
			if (value)
				Data.getPokemonByName(value)
					.then((data) => {
						Pokemons.render(data, parent, false);
					})
					.catch(console.log);
			else {
				Pokemons.render(pokemonList, parent, false);
			}
		});
	}
}

let app = new Module();
window.addEventListener("load", () => {
	app.load();
});
