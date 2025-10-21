// import express = require("express");
// import cors = require("cors");
import express from "express";
import cors from "cors";
import morgan from "morgan";
import diagnosesRouter from "./routes/diagnosesRouter.js";
import patientsRouter from "./routes/patientsRouter.js";
import { unknownEndpoint, errorMiddleware } from "./utils.js";

const app = express();
app.use(express.json());

const PORT = 3003;

app.use(
  cors({
    origin: "http://localhost:5173", // react address
    credentials: true, // to include cookies or credentials
  })
);

morgan.token("body", (req, _res) => {
  if ("body" in req && req.body) {
    return JSON.stringify(req.body);
  }
  return "-";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use(unknownEndpoint);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
