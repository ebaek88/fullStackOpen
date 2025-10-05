// import { parseArgumentsBmi } from "./validateInput.ts";
const { parseArgumentsBmi } = require("./validateInput.ts");

interface BmiRange {
  max: number;
  label: string;
}

const bmiRanges: BmiRange[] = [
  { max: 16, label: "Underweight (Severe thinness)" },
  { max: 17, label: "Underweight (Moderate thinness)" },
  { max: 18.5, label: "Underweight (Mild thinness)" },
  { max: 25, label: "Normal range" },
  { max: 30, label: "Overweight (Pre-obese)" },
  { max: 35, label: "Obese (Class I)" },
  { max: 40, label: "Obese (Class II)" },
];

const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // this works bc .find() returns the first element where the predicate is true.
  const range = bmiRanges.find((range) => bmi < range.max);
  return range?.label ?? "Obese (Class III)";
};

try {
  if (require.main === module) {
    const { height, weight } = parseArgumentsBmi(process.argv);
    console.log(calculateBmi(height, weight));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

module.exports = calculateBmi;
