// import { data } from "./data";

import * as express from "express";
import { pokApiRouter } from "./api/pokemon";
import * as https from "node:https";
const path = require("path");

const app: express.Application = express();

app.get(["/"], (_, res) => {
	res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", pokApiRouter);

const PORT = process.env.PORT || 3000;

https.createServer(app).listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
