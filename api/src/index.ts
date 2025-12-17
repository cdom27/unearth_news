import express from "express";
import cors from "cors";
import path from "path";
import { CLIENT_BUILD_PATH, PORT } from "./config/env";
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
const clientBuildPath = path.join(__dirname, CLIENT_BUILD_PATH);
app.use(express.static(clientBuildPath));

// routers
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/sources", sourceRouter);

app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const start = () => {
  initDatabase();

  app.listen(PORT || 8080, () => {
    console.log(`Listening on ${PORT}`);
  });
};

start();
