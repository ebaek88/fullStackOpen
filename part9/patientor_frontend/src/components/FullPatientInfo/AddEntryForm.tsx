import React, { useState } from "react";
import type { EntryWithoutId } from "../../types/entry.js";
import { HealthCheckRating } from "../../types/enums.js";
import {
  Alert,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  ListItemText,
  Input,
} from "@mui/material";

interface Props {
  onSubmit: (formValues: EntryWithoutId) => void;
  error: string;
  setError: (msg: string, duration?: number) => void;
  diagnosisCodesArray: string[];
}

enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

// constants
const currentDate: Date = new Date();

const defaultDateString: string = `${currentDate.getFullYear()}-${(
  currentDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const AddEntryForm = ({
  onSubmit,
  error,
  setError,
  diagnosisCodesArray,
}: Props) => {
  // states for data
  const [type, setType] = useState<
    "HealthCheck" | "OccupationalHealthcare" | "Hospital"
  >(EntryType.Hospital);
  const [description, setDescription] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [date, setDate] = useState<string>(defaultDateString);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStartDate, setSickLeaveStartDate] =
    useState<string>(defaultDateString);
  const [sickLeaveEndDate, setSickLeaveEndDate] =
    useState<string>(defaultDateString);
  const [dischargeDate, setDischargeDate] = useState<string>(defaultDateString);
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");
  // states for UI
  const [showHealthCheck, setShowHealthCheck] = useState<boolean>(false);
  const [showHospital, setShowHospital] = useState<boolean>(true);
  const [showOccupationalHealthcare, setShowOccupationalHealthcare] =
    useState<boolean>(false);

  // helper function
  const resetForm = () => {
    setDescription("");
    setDate(defaultDateString);
    setDiagnosisCodes([]);
    setSpecialist("");
    setEmployerName("");
    setDischargeDate(defaultDateString);
    setDischargeCriteria("");
    setSickLeaveStartDate(defaultDateString);
    setSickLeaveEndDate(defaultDateString);
  };

  // event handler
  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    let entryToAdd: EntryWithoutId;
    switch (type) {
      case "Hospital":
        entryToAdd = {
          type,
          description,
          specialist,
          date,
          diagnosisCodes,
        };
        if (dischargeDate && dischargeCriteria) {
          entryToAdd.discharge = {
            date: dischargeDate,
            criteria: dischargeCriteria,
          };
        }
        onSubmit(entryToAdd);
        break;
      case "HealthCheck":
        entryToAdd = {
          type,
          description,
          specialist,
          date,
          diagnosisCodes,
          healthCheckRating,
        };
        onSubmit(entryToAdd);
        break;
      case "OccupationalHealthcare":
        entryToAdd = {
          type,
          description,
          specialist,
          date,
          diagnosisCodes,
          employerName,
        };
        if (sickLeaveStartDate && sickLeaveEndDate) {
          entryToAdd.sickLeave = {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          };
        }
        onSubmit(entryToAdd);
        break;
      default:
        assertNever(type);
        break;
    }

    resetForm();
  };

  // for styling
  const componentStyle = {
    border: "1px",
    borderStyle: "dotted",
    borderRadius: "10px",
    padding: "8px",
    marginTop: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={componentStyle}>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submitHandler}>
        <FormControl>
          <FormLabel id="entry-type">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="entry-type"
            defaultValue="Hospital"
            name="entry-type-radio-buttons-group"
            value={type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newType = event.target.value as
                | "HealthCheck"
                | "OccupationalHealthcare"
                | "Hospital";

              switch (newType) {
                case "Hospital":
                  setShowHospital(true);
                  setShowHealthCheck(false);
                  setShowOccupationalHealthcare(false);
                  break;
                case "OccupationalHealthcare":
                  setShowOccupationalHealthcare(true);
                  setShowHospital(false);
                  setShowHealthCheck(false);
                  break;
                case "HealthCheck":
                  setShowHealthCheck(true);
                  setShowHospital(false);
                  setShowOccupationalHealthcare(false);
                  break;
                default:
                  setError("Wrong entry type!");
                  break;
              }
              setType(newType);
            }}
          >
            <FormControlLabel
              value="HealthCheck"
              control={<Radio />}
              label="HealthCheck"
            />
            <FormControlLabel
              value="OccupationalHealthcare"
              control={<Radio />}
              label="OccupationalHealthcare"
            />
            <FormControlLabel
              value="Hospital"
              control={<Radio />}
              label="Hospital"
            />
          </RadioGroup>
        </FormControl>
        <div>
          <label htmlFor="date">Date </label>
          <Input
            type="date"
            id="date"
            onChange={(evt) => setDate(evt.target.value)}
            inputProps={{ max: `${new Date().toISOString().slice(0, 10)}` }}
          />
        </div>
        <div>
          <TextField
            label="Description"
            aria-required
            fullWidth
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
            sx={{ marginY: "4px" }}
          />
        </div>
        <div>
          <TextField
            label="Specialist"
            aria-required
            fullWidth
            value={specialist}
            onChange={(evt) => setSpecialist(evt.target.value)}
            sx={{ marginY: "4px" }}
          />
        </div>
        <div>
          <InputLabel id="diagnosis-codes">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes"
            value={diagnosisCodes}
            label="Diagnosis codes"
            multiple
            fullWidth
            onChange={(evt) =>
              setDiagnosisCodes(
                typeof evt?.target?.value === "string"
                  ? evt.target.value.split(",")
                  : evt.target.value
              )
            }
            renderValue={(selected) => selected.join(",")}
            sx={{ marginY: "4px" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {diagnosisCodesArray.map((code) => (
              <MenuItem key={code} value={code}>
                <Checkbox checked={diagnosisCodes.includes(code)} />
                <ListItemText primary={code} />
              </MenuItem>
            ))}
          </Select>
        </div>
        {showHealthCheck && (
          <div>
            {/* <label>
              Healthcheck rating:{" "}
              <select
                value={healthCheckRating}
                onChange={(evt) =>
                  setHealthCheckRating(
                    Number(evt.target.value) as HealthCheckRating
                  )
                }
              >
                {Object.values(HealthCheckRating)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <option key={value} value={value}>
                      {HealthCheckRating[value]}
                    </option>
                  ))}
              </select>
            </label> */}
            <div>
              <InputLabel id="healthcheck-rating">
                Healthcheck rating
              </InputLabel>
              <Select
                labelId="healthcheck-rating"
                value={healthCheckRating}
                label="Healthcheck rating"
                fullWidth
                onChange={(evt) =>
                  setHealthCheckRating(
                    Number(evt.target.value) as HealthCheckRating
                  )
                }
                sx={{ marginY: "4px" }}
              >
                {Object.values(HealthCheckRating)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <MenuItem key={value} value={value}>
                      {HealthCheckRating[value]}
                    </MenuItem>
                  ))}
              </Select>
            </div>
          </div>
        )}
        {showOccupationalHealthcare && (
          <div>
            <div>
              <TextField
                label="Employer name"
                fullWidth
                value={employerName}
                onChange={(evt) => setEmployerName(evt.target.value)}
                sx={{ marginY: "4px" }}
              />
            </div>
            <div>
              <label htmlFor="sick-leave-start">Sick leave start: </label>
              <input
                type="date"
                id="sick-leave-start"
                onChange={(evt) => setSickLeaveStartDate(evt.target.value)}
                min={date}
                max={`${new Date().toISOString().slice(0, 10)}`}
              />
            </div>
            <div>
              <label htmlFor="sick-leave-end">Sick leave end: </label>
              <input
                type="date"
                id="sick-leave-end"
                onChange={(evt) => setSickLeaveEndDate(evt.target.value)}
                min={sickLeaveStartDate}
                max={`${new Date().toISOString().slice(0, 10)}`}
              />
            </div>
          </div>
        )}
        {showHospital && (
          <div>
            <div>
              <label htmlFor="discharge-date">Discharge date: </label>
              <input
                type="date"
                id="discharge-date"
                onChange={(evt) => setDischargeDate(evt.target.value)}
                min={date}
                max={`${new Date().toISOString().slice(0, 10)}`}
              />
            </div>
            <div>
              <TextField
                label="Discharge criteria"
                fullWidth
                value={dischargeCriteria}
                onChange={(evt) => setDischargeCriteria(evt.target.value)}
                sx={{ marginY: "4px" }}
              />
            </div>
          </div>
        )}
        <button type="reset" onClick={() => resetForm()}>
          RESET
        </button>{" "}
        <button type="submit">ADD</button>
      </form>
    </div>
  );
};

export default AddEntryForm;
