import * as z from "zod";

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

export const DiagnosisWithoutLatinSchema = DiagnosisSchema.omit({
  latin: true,
});
