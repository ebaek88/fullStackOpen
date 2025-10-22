import * as z from "zod";
import { HealthCheckRating } from "../types/enums.js";
import data from "../data/diagnoses.js";

const codes = data.map((diagnosis) => diagnosis.code);

// schema for entry types
const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
    message: "the date cannot be later than the current date",
  }),
  specialist: z.string(),
  diagnosisCodes: z
    .array(z.string())
    // this is to ensure that every diagnosis code in the array, if not empty, is included in the database
    .refine(
      (arr) => {
        if (arr.length === 0) return true;
        return arr.every((code) => codes.includes(code));
      },
      { message: "nonexistent diagnosis code" }
    )
    .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.enum(HealthCheckRating),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
        message: "the date cannot be later than the current date",
      }),
      endDate: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
        message: "the date cannot be later than the current date",
      }),
    })
    .optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z
    .object({
      date: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
        message: "the date cannot be later than the current date",
      }),
      criteria: z.string(),
    })
    .optional(),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

const HealthCheckEntryWithoutIdSchema = HealthCheckEntrySchema.omit({
  id: true,
});
const OccupationalHealthcareEntryWithoutIdSchema =
  OccupationalHealthcareEntrySchema.omit({ id: true });
const HospitalEntryWithoutIdSchema = HospitalEntrySchema.omit({ id: true });

export const EntryWithoutIdSchema = z.discriminatedUnion("type", [
  HealthCheckEntryWithoutIdSchema,
  OccupationalHealthcareEntryWithoutIdSchema,
  HospitalEntryWithoutIdSchema,
]);
