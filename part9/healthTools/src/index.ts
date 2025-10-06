import express from "express";
// import express = require("express"); // using this "hybrid" syntax bc "import" is needed to make sure VSCode knows the types.
// this is because @types/express uses ESModule...?
// const calculateBmi = require("./bmiCalculator.ts");
import { calculateBmi } from "./bmiCalculator.js"; // in ESM, import files should be in .js. tsx automatically converts .ts to .js.
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

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

app.post("/calculate", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!(daily_exercises && target) || daily_exercises?.length === 0) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    daily_exercises.some(
      (exercise: string | number) =>
        typeof exercise !== "number" || isNaN(Number(exercise))
    ) ||
    isNaN(Number(target))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
