import express from "express";
// import express = require("express"); // using this "hybrid" syntax bc "import" is needed to make sure VSCode knows the types.
// this is because @types/express uses ESModule...?
// const calculateBmi = require("./bmiCalculator.ts");
import { calculateBmi } from "./bmiCalculator.js"; // in ESM, import files should be in .js. tsx automatically converts .ts to .js.

const app = express();

app.get("/hello", (_req, res) => {
  res.send("<h2>Hello Full Stack!</h2>");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result = calculateBmi(Number(height), Number(weight));

  return res.json({
    height,
    weight,
    bmi: result,
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
