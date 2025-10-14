import { v1 as uuid } from "uuid";
import patientData from "../data/patients.js";
import type { Patient, PatientWithoutSsn, NewPatient } from "../types.js";

const patients: Array<Patient> = patientData;

const getFullPatients = (): Array<Patient> => {
  return patients;
};

const getPatientsWithoutSsn = (): Array<PatientWithoutSsn> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getFullPatients, getPatientsWithoutSsn, addPatient };
