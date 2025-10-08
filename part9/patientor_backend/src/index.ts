// import express = require("express");
// import cors = require("cors");
import express from "express";
import cors from "cors";
import diagnosesRouter from "./routes/diagnosesRouter.js";

const app = express();
app.use(express.json());

const PORT = 3003;

app.use(
  cors({
    origin: "http://localhost:5173", // react address
    credentials: true, // to include cookies or credentials
  })
);

app.use("/api/diagnoses", diagnosesRouter);

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
