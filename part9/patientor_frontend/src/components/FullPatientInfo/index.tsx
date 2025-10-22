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
  // const [errorMessage, setErrorMessage] = useState<string>("");

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
      <h3>entries</h3>
      {patient.entries.map((entry) => (
        <div key={entry.id}>
          <div>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>{entry.date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                  </TableRow>
                  {entry.diagnosisCodes && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <strong>Diagnosis Codes</strong>
                      </TableCell>
                    </TableRow>
                  )}
                  {entry.diagnosisCodes?.map((code) => (
                    <TableRow key={code}>
                      <TableCell>{code}</TableCell>
                      <TableCell>{diagnosesDescriptions[code]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
};

export default FullPatientInfo;
