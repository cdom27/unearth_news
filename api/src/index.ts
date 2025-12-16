import express from "express";
import cors from "cors";
import path from "path";
import { CLIENT_ORIGIN, PORT } from "./config/env";
import articleRouter from "./modules/articles/router";
import sourceRouter from "./modules/sources/router";
import { initDatabase } from "./db/client";

const app = express();

// trust cloud run reverse proxy
app.set("trust proxy", 1);

// middlewares
app.use(cors());

app.use(express.json());

// serve client
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

// routers
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/sources", sourceRouter);

const start = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
};

start();
