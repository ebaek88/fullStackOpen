import * as z from "zod";
import {
  EntrySchema,
  EntryWithoutIdSchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
} from "../schemas/entrySchema.js";

export type HospitalEntry = z.infer<typeof HospitalEntrySchema>;

export type OccupationalHealthcareEntry = z.infer<
  typeof OccupationalHealthcareEntrySchema
>;

export type HealthCheckEntry = z.infer<typeof HealthCheckEntrySchema>;

export type Entry = z.infer<typeof EntrySchema>;

export type EntryWithoutId = z.infer<typeof EntryWithoutIdSchema>;
