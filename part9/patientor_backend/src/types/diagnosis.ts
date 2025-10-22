import {
  DiagnosisSchema,
  DiagnosisWithoutLatinSchema,
} from "../schemas/diagnosisSchema.js";
import * as z from "zod";

// export interface Diagnosis {
//   code: string;
//   name: string;
//   latin?: string;
// }

// export type DiagnosisWithoutLatin = Omit<Diagnosis, "latin">;
export type Diagnosis = z.infer<typeof DiagnosisSchema>;
export type DiagnosisWithoutLatin = z.infer<typeof DiagnosisWithoutLatinSchema>;
