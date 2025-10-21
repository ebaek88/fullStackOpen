import * as z from "zod";
import { NewPatientSchema } from "../schemas/patientSchema.js";
import type { Entry } from "./entry.js";
import { Gender } from "./enums.js";

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Array<Entry>;
}

export type PatientWithoutSsn = Omit<Patient, "ssn">;

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

// export type NewPatient = Omit<Patient, "id">;
export type NewPatient = z.infer<typeof NewPatientSchema>;
