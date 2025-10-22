import * as z from "zod";
import {
  NewPatientSchema,
  PatientSchema,
  PatientWithoutSsnSchema,
} from "../schemas/patientSchema.js";

// export interface Patient {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   ssn: string;
//   gender: Gender;
//   occupation: string;
//   entries: Array<Entry>;
// }
export type Patient = z.infer<typeof PatientSchema>;

// export type PatientWithoutSsn = Omit<Patient, "ssn">;
export type PatientWithoutSsn = z.infer<typeof PatientWithoutSsnSchema>;

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

// export type NewPatient = Omit<Patient, "id">;
export type NewPatient = z.infer<typeof NewPatientSchema>;

export type PatientFormValues = Omit<Patient, "id" | "entries">;
