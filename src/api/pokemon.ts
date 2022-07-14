import * as express from "express";
import {
	getPokemonById,
	getPokemonsByName,
	getPokemonsRange,
} from "../db/mongo";

export const pokApiRouter = express.Router();

pokApiRouter.get("/pokemons", async (req, res) => {
	let offset = Number(req.query.offset) || 0;
	let limit = Number(req.query.limit) || 50;

	let response = await getPokemonsRange(offset, limit);
	let pokemons = response.pokemons;

	let next =
		"//" +
		req.get("host") +
		`/api/pokemons?offset=${offset + pokemons.length}&limit=${limit}`;
	let count = response.count;
	console.log(next);
	let payload = {
		results: pokemons,
		next: next,
		count,
		success: !!pokemons.length,
	};
	res.json(payload);
});

pokApiRouter.get("/pokemons/:id", async (req, res) => {
	try {
		let pokemon = await getPokemonById(req.params.id);

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
	} catch (error) {
		res.status(404).json({
			success: false,
			message: "an error occurred try again later",
		});
	}
});

pokApiRouter.get("/pokemons/name/:name", async (req, res) => {
	try {
		let offset = Number(req.query.offset) || 0;
		let limit = Number(req.query.limit) || 50;

		let response = await getPokemonsByName(
			req.params.name.toLowerCase(),
			offset,
			limit
		);
		let pokemons = response.response;
		let count = response.count;

		let next =
			"//" +
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
	} catch {
		res.json({
			results: [],
			success: false,
			next: "",
			count: 0,
		});
	}
});
