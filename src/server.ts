if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
import * as express from "express";
import { pokApiRouter } from "./api/pokemon";
import * as path from "path";

const app: express.Application = express();

app.enable("trust proxy");

app.get(["/"], (_, res) => {
	res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", pokApiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
