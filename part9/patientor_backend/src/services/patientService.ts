import patientData from "../data/patients.js";
import type { Patient, PatientWithoutSsn } from "../types.js";

const patients: Array<Patient> = patientData;

const validateDate = (patients: Array<Patient>): boolean => {
  return patients.every((patient) => {
    // returns false if the DOB does not exist
    if (!patient.dateOfBirth || typeof patient.dateOfBirth !== "string")
      return false;

    // returns false if the DOB is in invalid format
    const date = new Date(patient.dateOfBirth);
    if (isNaN(date.getTime())) return false;

    // returns false if the DOB is later than the current date
    const now = new Date();
    if (date > now) return false;

    return true;
  });
};

const getFullPatients = (): Array<Patient> => {
  if (!validateDate(patients)) {
    throw new Error("some patient's date of birth is in incorrect format");
  }
  return patients;
};

const getPatientsWithoutSsn = (): Array<PatientWithoutSsn> => {
  if (!validateDate(patients)) {
    throw new Error("some patient's date of birth is in incorrect format");
  }
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default { getFullPatients, getPatientsWithoutSsn };
