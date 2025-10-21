import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useState, useEffect } from "react";
import patientService from "../../services/patients.js";
import type { Patient } from "../../types.js";

interface Props {
  patientId: string | null | undefined;
}

const FullPatientInfo = ({ patientId }: Props) => {
  if (!patientId) {
    return (
      <div>
        The full information for the corresponding patient is not available.
      </div>
    );
  }

  const [patient, setPatient] = useState<Patient | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchIndividualPatient = async (id: string) => {
      try {
        const patient = await patientService.getIndividualFull(id);
        setPatient(patient);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.message);
          setErrorMessage(error.message);
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
        <div>{errorMessage}</div>
      </>
    );
  }

  return (
    <div>
      <h3>
        {patient.name}{" "}
        {patient.gender === "male" ? (
          <MaleIcon />
        ) : patient.gender === "female" ? (
          <FemaleIcon />
        ) : (
          <QuestionMarkIcon />
        )}
      </h3>
      <table>
        <tbody>
          <tr>
            <td>Date Of Birth</td>
            <td>{patient.dateOfBirth}</td>
          </tr>
          <tr>
            <td>Social Security Number</td>
            <td>{patient.ssn}</td>
          </tr>
          <tr>
            <td>Occupation</td>
            <td>{patient.occupation}</td>
          </tr>
          <tr>
            <td>Entries</td>
            {!patient.entries || patient.entries.length === 0 ? (
              <td>soon to be updated</td>
            ) : (
              <td>-</td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FullPatientInfo;
