import * as z from "zod";
import { EntrySchema } from "./entrySchema.js";
import { Gender } from "../types/enums.js";

// schema for a new patient
const ssnRegex = /(\d{6})-(\d{2,3}[A-Z0-9])/; // regex for validating SSN format

export const PatientSchema = z.object({
  id: z.uuid({ version: "v1" }),
  name: z.string(),
  dateOfBirth: z.iso.date().refine((val) => Date.parse(val) <= Date.now(), {
    message: "the date cannot be later than the current date",
  }),
  ssn: z.string().regex(ssnRegex),
  entries: z.array(EntrySchema),
  gender: z.enum(Gender),
  occupation: z.string(),
});

// also made entries optional for NewPatientSchema, since a new patient is added first and then his/her entries.
export const NewPatientSchema = PatientSchema.omit({ id: true }).extend({
  entries: z.array(EntrySchema).optional().default([]),
});
