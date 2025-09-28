import express from "express";
import cors from "cors";
import { CLIENT_ORIGIN, PORT } from "./config/env";
import articleRouter from "./modules/articles/router";

const app = express();

// middlwares
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// routers
app.use("/api/v1/articles", articleRouter);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
