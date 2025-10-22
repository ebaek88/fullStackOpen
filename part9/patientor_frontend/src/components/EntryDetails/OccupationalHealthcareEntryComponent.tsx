import { useState } from "react";
import WorkIcon from "@mui/icons-material/Work";
import type { OccupationalHealthcareEntry } from "../../types/entry.js";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnosesDescriptions: { [code: string]: string };
}

const componentStyle = {
  border: "1px",
  borderStyle: "solid",
  borderRadius: "10px",
  padding: "8px",
  marginBottom: "10px",
};

const listStyle = { marginLeft: "20px" };

const OccupationalHealthcareEntryComponent = ({
  entry,
  diagnosesDescriptions,
}: Props) => {
  const [showDiagnosisCodes, setShowDiagnosisCodes] = useState<boolean>(false);

  return (
    <div style={componentStyle}>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <div>
          <button onClick={() => setShowDiagnosisCodes(!showDiagnosisCodes)}>
            {showDiagnosisCodes ? "hide " : "show "}"diagnosis codes"
          </button>
        </div>
      )}
      <div>
        {entry.date} <WorkIcon /> <em>{entry.employerName}</em>
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      {showDiagnosisCodes && (
        <div>
          <div>
            <strong>Diagnosis codes</strong>
          </div>
          {entry.diagnosisCodes?.map((code) => (
            <div key={code}>
              <li style={listStyle}>
                {code}: {diagnosesDescriptions[code]}
              </li>
            </div>
          ))}
        </div>
      )}
      <div>diagnosed by {entry.specialist}</div>
    </div>
  );
};

export default OccupationalHealthcareEntryComponent;
