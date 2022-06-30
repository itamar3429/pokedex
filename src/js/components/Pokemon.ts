// Renders a given pokemon to its parent.
class Pokemon {
	static render(pokemon: any, parent: HTMLElement) {
		let div = document.createElement("div");
		div.classList.add("pokemon");

		div.innerHTML = `
		<h3 class="name">${pokemon.name}</h3>
		<div class="img">
			<img src="${pokemon.sprites.front_default || "./img/default.png"}" alt="${
			pokemon.name
		} pokemon">
		</div>
		<div class="info">
			<p class="type"><span>specie: </span>${pokemon.types[0].type.name}</p>
			<p class="height"><span>height: </span>${pokemon.height}</p>
			<p class="weight"><span>weight: </span>${pokemon.weight}</p>
		</div>
		`;

		parent.appendChild(div);
	}
}

// Gets a list of pokemons and renders them to the parent with the Pokemon class
export class Pokemons {
	static render(pokemons: any[], parent: HTMLElement, add: boolean) {
		if (!add) parent.innerHTML = "";
		pokemons.forEach((p) => {
			if (p) Pokemon.render(p, parent);
		});
	}
}
