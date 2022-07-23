import { IPokemon } from "../Data";

// Renders a given pokemon to its parent.
class Pokemon {
	static render(pokemon: IPokemon, parent: HTMLElement) {
		let div = document.createElement("div");
		div.classList.add("pokemon");

		let onerror = `(() => {
			if (this.src != '${pokemon.img[1]}') this.src = '${pokemon.img[1]}';
			else {
				this.src = '/img/default.png';
				this.onerror = null;
			}
		})()`;

		div.innerHTML = `
		<h3 class="name">${pokemon.name.replace("/", " /")}</h3>
		<div class="img">
			<img src="${pokemon.img[0] || "/img/default.png"}" alt="${
			pokemon.name
		} pokemon" onerror="${onerror}">
		</div>
		<div class="info">
			<p class="type"><span>type: </span><span class="${pokemon.specie}">${
			pokemon.specie
		}</span></p>
			<p class="height"><span>height: </span>${pokemon.height}</p>
			<p class="weight"><span>weight: </span>${pokemon.weight}</p>
		</div>
		`;

		parent.appendChild(div);
	}
}

// Gets a list of pokemons and renders them to the parent with the Pokemon class
export class Pokemons {
	static render(pokemons: IPokemon[], parent: HTMLElement, add: boolean) {
		if (!add) parent.innerHTML = "";
		pokemons.forEach((p) => {
			if (p) Pokemon.render(p, parent);
		});
	}
}
