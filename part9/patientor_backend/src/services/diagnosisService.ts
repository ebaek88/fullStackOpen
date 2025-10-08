import diagnosisData from "../data/diagnoses.js";
import type { Diagnosis, DiagnosisWithoutLatin } from "../types.js";

const diagnoses: Diagnosis[] = diagnosisData;

const getFullDiagnoses = () => {
  return diagnoses;
};

const getDiagnosesWithoutLatin = (): DiagnosisWithoutLatin[] => {
  return diagnoses.map(({ code, name }) => ({
    code,
    name,
  }));
};

export default { getFullDiagnoses, getDiagnosesWithoutLatin };
