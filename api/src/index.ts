import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import analysisRouter from "./modules/analyses/router";

const app = express();

// middlwares
app.use(cors());
app.use(express.json());

// routers
app.use("/api/v1/analyses", analysisRouter);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
