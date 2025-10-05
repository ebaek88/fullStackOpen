// import { parseArgumentsExerciseCalculator } from "./validateInput.ts";
const { parseArgumentsExerciseCalculator } = require("./validateInput.ts");

// interface Ratings {
//   differenceMax: number;
//   rating: number;
//   explanation: string;
// }

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

// const exerciseRanges: Ratings[] = [
//   {
//     differenceMax: -1.0,
//     rating: 1,
//     explanation: "you need to exercise more to reach your target",
//   },
//   {
//     differenceMax: -0.25,
//     rating: 2,
//     explanation: "not too bad but could be be better",
//   },
//   {
//     differenceMax: 0.25,
//     rating: 3,
//     explanation: "you are really doing well. keep going!",
//   },
//   {
//     differenceMax: 0.5,
//     rating: 2,
//     explanation: "not too bad but could be be better",
//   },
// ];

const calculateExercises = (dailyHours: number[], target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((dailyHour) => dailyHour > 0).length;
  const average =
    dailyHours.reduce((acc, curr) => acc + curr, 0) / periodLength;
  const difference = average - target;
  const success = difference >= 0;
  // const exerciseRating = exerciseRanges.find(
  //   (range) => difference < range.differenceMax
  // );
  // const { rating, explanation: ratingDescription } = exerciseRating ?? {
  //   rating: 1,
  //   explanation: "you are exercising too much.",
  // };
  let rating = 0,
    ratingDescription = "";

  switch (true) {
    case difference < -1.0 || difference >= 0.5:
      rating = 1;
      ratingDescription =
        difference < -1.0
          ? "you need to exercise more to reach your target"
          : "you are exercising too much.";
      break;
    case (difference >= -1.0 && difference < -0.25) ||
      (difference >= 0.25 && difference < 0.5):
      rating = 2;
      ratingDescription = "not too bad but could be be better";
      break;
    case difference >= -0.25 && difference < 0.25:
      rating = 3;
      ratingDescription = "you are really doing well. keep going!";
      break;
    default:
      throw new Error("cannot interpret the data");
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  if (require.main === module) {
    const { target, dailyHours } = parseArgumentsExerciseCalculator(
      process.argv
    );
    console.log(calculateExercises(dailyHours, target));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

// console.log(calculateExercises([0, 0, 0, 4.5, 0, 0, 1], 2)); //'you need to exercise more to reach your target'
// console.log(calculateExercises([0, 0, 1, 4.5, 0, 3, 1], 2)); //'not too bad but could be be better'
// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2)); //'you are really doing well. keep going!'
// console.log(calculateExercises([3, 3, 3, 4.5, 1, 1.5, 1], 2)); //'not too bad but could be be better'
// console.log(calculateExercises([3, 3, 3, 4.5, 1.5, 1.5, 1], 2)); //'you are exercising too much.'
