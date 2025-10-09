import diagnosisData from "../data/diagnoses.js";
import type { Diagnosis, DiagnosisWithoutLatin } from "../types.js";

const diagnoses: Array<Diagnosis> = diagnosisData;

const getFullDiagnoses = (): Array<Diagnosis> => {
  return diagnoses;
};

const getDiagnosesWithoutLatin = (): Array<DiagnosisWithoutLatin> => {
  return diagnoses.map(({ code, name }) => ({
    code,
    name,
  }));
};

export default { getFullDiagnoses, getDiagnosesWithoutLatin };
