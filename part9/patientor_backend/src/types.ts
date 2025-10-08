export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type DiagnosisWithoutLatin = Omit<Diagnosis, "latin">;
