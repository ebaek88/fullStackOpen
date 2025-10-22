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

import { useState, useEffect } from "react";
import patientService from "../../services/patients.js";

import type { Patient } from "../../types/patient.js";
import type { DiagnosisWithoutLatin } from "../../types/diagnosis.js";

import EntryDetails from "../EntryDetails/index.tsx";

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
  diagnoses.forEach((obj) => {
    diagnosesDescriptions[obj.code] = obj.name;
  });

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
      {patient.entries && patient.entries.length > 0 && (
        <div style={{ margin: "10px" }}>
          <strong>entries</strong>{" "}
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
