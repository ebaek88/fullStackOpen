// for validating command-line arguments for bmiCalculator.ts
interface bmiInputs {
  height: number;
  weight: number;
}

interface exerciseCalculatorInputs {
  target: number;
  daily_exercises: number[];
}

const parseArgumentsBmi = (args: string[]): bmiInputs => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const parseArgumentsExerciseCalculator = (
  args: string[]
): exerciseCalculatorInputs => {
  if (args.length < 4) throw new Error("Not enough arguments");
  const [, , target, ...rest] = args;
  const targetInNumber = Number(target);
  // console.log(targetInNumber);
  if (isNaN(targetInNumber)) throw new Error("The target is not a number!");
  if (rest.length === 0)
    throw new Error("Not enough input for daily hours recorded!");
  const daily_exercises = rest.map((val) => Number(val));
  if (daily_exercises.every((val) => !isNaN(Number(val)))) {
    return {
      target: targetInNumber,
      daily_exercises,
    };
  } else {
    throw new Error("Some input in daily hours is not a number!");
  }
};

// need to use "export type" when exporting a type and when "verbatimModuleSyntax" at tsconfig is on
// "export type" tells TypeScript that you're only exporting the TYPE, not a value that exists at runtime.
// This is what "verbatimModuleSyntax" enforces.
export type { bmiInputs };
export { parseArgumentsBmi, parseArgumentsExerciseCalculator };
