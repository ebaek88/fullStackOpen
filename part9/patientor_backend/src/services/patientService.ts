import * as z from "zod";
import { v1 as uuid } from "uuid";
import patientData from "../data/patients.js";
import type {
  Patient,
  PatientWithoutSsn,
  NewPatient,
} from "../types/patient.js";
import type { EntryWithoutId } from "../types/entry.js";

// import { NewPatientSchema } from "../schemas/patientSchema.js";

const patients: Array<Patient> = patientData;

const getFullPatients = (): Array<Patient> => {
  return patients;
};

const getPatientsWithoutSsn = (): Array<PatientWithoutSsn> => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const getIndividualPatient = (id: string) => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  // const parsedEntry = NewPatientSchema.parse(entry);
  const newPatient = {
    id: z.uuid({ version: "v1" }).parse(uuid()),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: EntryWithoutId) => {
  const patientToAdd = patients.find((patient) => patient.id === id);
  if (!patientToAdd) return;

  const newEntry = {
    id: z.uuid({ version: "v1" }).parse(uuid()),
    ...entry,
  };

  patientToAdd.entries.push(newEntry);
  return newEntry;
};

export default {
  getFullPatients,
  getPatientsWithoutSsn,
  getIndividualPatient,
  addPatient,
  addEntry,
};
