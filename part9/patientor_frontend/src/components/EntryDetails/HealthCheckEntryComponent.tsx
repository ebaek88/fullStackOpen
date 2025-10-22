import { useState } from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { HealthCheckEntry } from "../../types/entry.js";

interface Props {
  entry: HealthCheckEntry;
  diagnosesDescriptions: { [code: string]: string };
}

const heartColor: { [rating: number]: string } = {
  0: "green",
  1: "yellow",
  2: "orange",
  3: "red",
};

const componentStyle = {
  border: "1px",
  borderStyle: "solid",
  borderRadius: "10px",
  padding: "8px",
  marginBottom: "10px",
};

const listStyle = { marginLeft: "20px" };

const HealthCheckEntryComponent = ({ entry, diagnosesDescriptions }: Props) => {
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
        {entry.date} <MedicalServicesIcon />
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      <div>
        <FavoriteIcon sx={{ color: heartColor[entry.healthCheckRating] }} />
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

export default HealthCheckEntryComponent;
