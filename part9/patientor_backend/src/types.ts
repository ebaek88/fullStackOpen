import * as z from "zod";
import { NewPatientSchema } from "./utils.js";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type DiagnosisWithoutLatin = Omit<Diagnosis, "latin">;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type PatientWithoutSsn = Omit<Patient, "ssn">;

// export type NewPatient = Omit<Patient, "id">;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
  Undisclosed = "undisclosed",
}

export type NewPatient = z.infer<typeof NewPatientSchema>;
