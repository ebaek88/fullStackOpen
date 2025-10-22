import axios from "axios";
import type { DiagnosisWithoutLatin } from "../types/diagnosis.js";
import { apiBaseUrl } from "../constants.js";

const getAllWithoutLatin = async () => {
  const response = await axios.get<Array<DiagnosisWithoutLatin>>(
    `${apiBaseUrl}/diagnoses`
  );
  return response.data;
};

export default { getAllWithoutLatin };
