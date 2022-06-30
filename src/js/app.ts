import { Pokemons } from "./components/Pokemon";
import { Data, IPokemon } from "./Data";

// module to get the page going
class Module {
	pokemonList: any[] = [];
	page = 1;

	// Loads the first content to the page
	async load() {
		localStorage.setItem("pokemons", ""); // remove all pokemons when page first loads
		this.loader(true);
		this.pokemonList = await Data.getPokemonList(50, this.page);
		this.render(this.pokemonList, false);
		this.loader(false);
		this.page = 1;
	}

	// Searches by input on input change
	addInputListener() {
		document.getElementById("search-form")?.addEventListener("submit", (e) => {
			e.preventDefault();
		});

		// add input listener to load matching pokemons on input writing.
		let input = document.getElementById("search-input") as HTMLInputElement;
		input.addEventListener("input", (e) => {
			e.preventDefault();
			let value = input.value;
			if (value) {
				Data.getPokemonByName(value, 50, 1)
					.then((data) => {
						this.render(data, false);
					})
					.catch(console.log);
			} else {
				this.render(this.pokemonList, false);
			}
			this.page = 1;
		});
	}

	// gets a list of pokemons data and renders them to the page
	render(pokemonList: IPokemon[], isAdd: boolean) {
		let parent = document.getElementById("list-container") as HTMLDivElement;
		Pokemons.render(pokemonList, parent, isAdd);
	}

	// Loads more pokemons when reaching the bottom of the document.
	loadMorePokemons() {
		let time = 1;
		var lastScrollTop = 0;
		window.addEventListener("scroll", () => {
			var st = window.pageYOffset || document.documentElement.scrollTop;
			if (st > lastScrollTop)
				if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
					if (time) {
						this.loader(true);
						time = 0;
						this.page++;
						let input = document.getElementById(
							"search-input"
						) as HTMLInputElement;
						let pokemonList;
						if (input.value) {
							pokemonList = Data.getPokemonByName(input.value, 50, this.page);
						} else {
							pokemonList = Data.getPokemonList(50, this.page);
						}

						pokemonList
							.then((data) => {
								setTimeout(() => {
									this.render(data, true);
									this.loader(false);
								}, 500);
							})
							.catch(console.log);
					} else time = 1;
				}
			lastScrollTop = st <= 0 ? 0 : st;
		});
	}

	// Shows and hides the loader icon when loading more pokemons
	loader(show: boolean) {
		let loader = document.getElementById("loader") as HTMLElement;
		show ? loader.classList.add("show") : loader.classList.remove("show");
	}
}

let app = new Module();
window.addEventListener("load", () => {
	app.load();
	app.addInputListener();
	app.loadMorePokemons();
});
