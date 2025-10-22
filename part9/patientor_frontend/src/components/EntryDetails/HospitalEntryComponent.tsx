import { useState } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import type { HospitalEntry } from "../../types/entry.js";

interface Props {
  entry: HospitalEntry;
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

const HospitalEntryComponent = ({ entry, diagnosesDescriptions }: Props) => {
  const [showDiagnosisCodes, setShowDiagnosisCodes] = useState<boolean>(false);

  return (
    <div style={componentStyle}>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <div>
          <button onClick={() => setShowDiagnosisCodes(!showDiagnosisCodes)}>
            {showDiagnosisCodes ? "hide " : "show "}diagnosis codes
          </button>
        </div>
      )}
      <div>
        {entry.date} <LocalHospitalIcon />
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
      {entry.discharge && (
        <div>
          <strong>Discharge</strong>
          <li style={listStyle}>Date: {entry.discharge.date}</li>
          <li style={listStyle}>Reason: {entry.discharge.criteria}</li>
        </div>
      )}
      <div>diagnosed by {entry.specialist}</div>
    </div>
  );
};

export default HospitalEntryComponent;
