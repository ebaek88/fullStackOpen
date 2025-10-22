import axios from "axios";
import type {
  Patient,
  PatientFormValues,
  PatientWithoutSsn,
} from "../types/patient.js";
import {
  PatientSchema,
  PatientWithoutSsnSchema,
} from "../schemas/patientSchema.js";
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

// for PatientFormValues, it is not validated with Zod schema yet
const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

export default {
  getAll,
  getAllWithoutSsn,
  create,
  getIndividualFull,
};
