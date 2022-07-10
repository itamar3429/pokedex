// import { data } from "./data";

import * as express from "express";
import { pokApiRouter } from "./api/pokemon";
const path = require("path");

const app: express.Application = express();

app.enable("trust proxy");

app.use((req, _, next) => {
	console.log(req.socket.remoteAddress);
	console.log(req.headers["x-forwarded-for"]);
	next();
});

app.get(["/"], (_, res) => {
	res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", pokApiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
