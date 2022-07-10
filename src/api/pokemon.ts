// import { Router } from "express";
import * as express from "express";
import { data } from "../data";

export const pokApiRouter = express.Router();

pokApiRouter.get("/pokemons", (req, res) => {
	let offset = Number(req.query.offset) || 0;
	let limit = Number(req.query.limit) || 50;
	let pokemons = data.slice(offset, offset + limit);
	console.log(req.protocol);

	let next =
		// req.protocol +
		"//" +
		req.get("host") +
		`/api/pokemons?offset=${offset + pokemons.length}&limit=${limit}`;
	let count = data.length;
	console.log(next);
	let payload = {
		results: pokemons,
		next: next,
		count,
		success: !!pokemons.length,
	};
	res.json(payload);
});

pokApiRouter.get("/pokemons/:id", (req, res) => {
	let pokemon = data.find((p) => p.id == Number(req.params.id));

	if (pokemon) {
		res.json({
			results: pokemon,
			success: true,
		});
	} else {
		res.status(404).json({
			success: false,
			message: "couldn't find the requested pokemon",
		});
	}
});

pokApiRouter.get("/pokemons/name/:name", (req, res) => {
	let offset = Number(req.query.offset) || 0;
	let limit = Number(req.query.limit) || 50;
	let pokemons = data.filter((p) => {
		return p.name
			.toLowerCase()
			.match(new RegExp("^" + req.params.name.toLowerCase()));
	});
	let count = pokemons.length;
	pokemons = pokemons.slice(offset, offset + limit);

	let next =
		req.protocol +
		"://" +
		req.get("host") +
		`${req.originalUrl.split("?")[0]}?offset=${
			offset + pokemons.length
		}&limit=${limit}`;

	res.json({
		results: pokemons,
		success: !!pokemons.length,
		next,
		count,
	});
});
