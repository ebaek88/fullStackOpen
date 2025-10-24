import axios from "axios";
import type {
  Patient,
  PatientFormValues,
  PatientWithoutSsn,
} from "../types/patient.js";
import type { Entry, EntryWithoutId } from "../types/entry.js";
import {
  PatientSchema,
  PatientWithoutSsnSchema,
} from "../schemas/patientSchema.js";
import { EntrySchema } from "../schemas/entrySchema.js";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Array<Patient>>(`${apiBaseUrl}/patients`);
  return data.map((patient) => PatientSchema.parse(patient));
};

const getAllWithoutSsn = async () => {
  const { data } = await axios.get<Array<PatientWithoutSsn>>(
    `${apiBaseUrl}/patients/without-ssn`
  );
  return data.map((patient) => PatientWithoutSsnSchema.parse(patient));
};

const getIndividualFull = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return PatientSchema.parse(data);
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
  return PatientSchema.parse(data);
};

const createEntry = async (id: string, object: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );
  return EntrySchema.parse(data);
};

export default {
  getAll,
  getAllWithoutSsn,
  create,
  createEntry,
  getIndividualFull,
};
