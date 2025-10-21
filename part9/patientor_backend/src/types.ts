// export interface BaseEntry {
//   id: string;
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes?: Array<Diagnosis["code"]>;
// }

// export interface HealthCheckEntry extends BaseEntry {
//   type: "HealthCheck";
//   healthCheckRating: HealthCheckRating;
// }

// export interface SickLeave {
//   startDate: string;
//   endDate: string;
// }

// export interface OccupationalHealthcareEntry extends BaseEntry {
//   type: "OccupationalHealthcare";
//   employerName: string;
//   sickLeave?: SickLeave;
// }

// export interface Discharge {
//   date: string;
//   criteria: string;
// }

// export interface HospitalEntry extends BaseEntry {
//   type: "Hospital";
//   discharge?: Discharge;
// }

// export type Entry =
//   | HealthCheckEntry
//   | OccupationalHealthcareEntry
//   | HospitalEntry;
