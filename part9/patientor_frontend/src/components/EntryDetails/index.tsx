import type { Entry } from "../../types/entry.js";
import HealthCheckEntryComponent from "./HealthCheckEntryComponent.js";
import HospitalEntryComponent from "./HospitalEntryComponent.js";
import OccupationalHealthcareEntryComponent from "./OccupationalHealthcareEntryComponent.js";

interface Props {
  entry: Entry;
  diagnosesDescriptions: { [code: string]: string };
}

const assertNever = (value: never) => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry, diagnosesDescriptions }: Props) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <HealthCheckEntryComponent
          entry={entry}
          diagnosesDescriptions={diagnosesDescriptions}
        />
      );
    case "Hospital":
      return (
        <HospitalEntryComponent
          entry={entry}
          diagnosesDescriptions={diagnosesDescriptions}
        />
      );
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareEntryComponent
          entry={entry}
          diagnosesDescriptions={diagnosesDescriptions}
        />
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
