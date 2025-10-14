import { type NewPatient, Gender } from "./types.js";

// name, ssn, dateOfBirth, gender, occupation
const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((value) => value.toString())
    .includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const parseSsn = (ssn: unknown): string => {
  const ssnRegex = /(\d{6})-(\d{2,3}[A-Z0-9])/; // regex for validating SSN format

  if (!ssn || !isString(ssn) || !ssnRegex.test(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (
    !dateOfBirth ||
    !isString(dateOfBirth) ||
    !isDate(dateOfBirth) ||
    Date.parse(dateOfBirth) > Date.now()
  ) {
    throw new Error("Incorrect or missing date");
  }

  return dateOfBirth;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }

  return gender;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      ssn: parseSsn(object.ssn),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export default toNewPatient;
