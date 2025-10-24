import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { useState, useEffect, useRef } from "react";
import patientService from "../../services/patients.js";

import type { Patient } from "../../types/patient.js";
import type { DiagnosisWithoutLatin } from "../../types/diagnosis.js";
import type { EntryWithoutId } from "../../types/entry.ts";

import EntryDetails from "../EntryDetails/index.tsx";
import AddEntryForm from "./AddEntryForm.tsx";

interface Props {
  patientId: string | null | undefined;
  showNotification: (msg: string, duration?: number) => void;
  diagnoses: Array<DiagnosisWithoutLatin>;
}

const FullPatientInfo = ({ patientId, showNotification, diagnoses }: Props) => {
  if (!patientId) {
    return (
      <div>
        The full information for the corresponding patient is not available.
      </div>
    );
  }

  const [patient, setPatient] = useState<Patient | null>(null);
  const [showEntries, setShowEntries] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const formErrorTimeoutId = useRef<number | null>(null);

  const showFormError = (msg: string, duration = 3000) => {
    setFormError(msg);
    if (formErrorTimeoutId.current) {
      clearTimeout(formErrorTimeoutId.current);
    }
    formErrorTimeoutId.current = window.setTimeout(
      () => setFormError(""),
      duration
    );
  };

  const submitNewEntry = async (formValues: EntryWithoutId) => {
    try {
      const entry = await patientService.createEntry(patientId, formValues);
      if (entry !== undefined) {
        if (!patient) return;
        setPatient({
          ...patient,
          entries: (patient.entries ?? []).concat(entry),
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error?.response?.data?.message);
        showFormError(error?.response?.data?.message);
      } else {
        console.error(error);
        showFormError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const fetchIndividualPatient = async (id: string) => {
      try {
        const patient = await patientService.getIndividualFull(id);
        setPatient(patient);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.message);
          showNotification(error.message);
        }
      }
    };

    fetchIndividualPatient(patientId);
  }, []);

  if (!patient) {
    return (
      <>
        <div>
          The full information for the corresponding patient is not available:
        </div>
      </>
    );
  }

  const diagnosesDescriptions: { [code: string]: string } = {};
  const diagnosisCodesArray: string[] = [];
  for (let obj of diagnoses) {
    diagnosesDescriptions[obj.code] = obj.name;
    diagnosisCodesArray.push(obj.code);
  }

  return (
    <div>
      <h2>
        {patient.name}{" "}
        {patient.gender === "male" ? (
          <MaleIcon />
        ) : patient.gender === "female" ? (
          <FemaleIcon />
        ) : (
          <QuestionMarkIcon />
        )}
      </h2>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Date Of Birth</strong>
              </TableCell>
              <TableCell>{patient.dateOfBirth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Social Security Number</strong>
              </TableCell>
              <TableCell>{patient.ssn}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Occupation</strong>
              </TableCell>
              <TableCell>{patient.occupation}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "10px" }}>
        <strong>Add a new entry</strong>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "hide " : "show "}new entry form
        </button>
        {showForm && (
          <AddEntryForm
            onSubmit={submitNewEntry}
            error={formError}
            setError={showFormError}
            diagnosisCodesArray={diagnosisCodesArray}
            setShowForm={setShowForm}
          />
        )}
      </div>
      {patient.entries && patient.entries.length > 0 && (
        <div style={{ margin: "10px" }}>
          <strong>Entries</strong>{" "}
          <button onClick={() => setShowEntries(!showEntries)}>
            {showEntries ? "hide " : "show "}entries
          </button>
        </div>
      )}
      {showEntries &&
        patient.entries.map((entry) => (
          <EntryDetails
            key={entry.id}
            entry={entry}
            diagnosesDescriptions={diagnosesDescriptions}
          />
        ))}
    </div>
  );
};

export default FullPatientInfo;
