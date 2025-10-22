import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import type { Patient } from "./types/patient.js";
import type { DiagnosisWithoutLatin } from "./types/diagnosis.js";

import patientService from "./services/patients";
import diagnosesService from "./services/diagnoses.ts";

import PatientListPage from "./components/PatientListPage/index.tsx";
import FullPatientInfo from "./components/FullPatientInfo/index.tsx";
import Notification from "./components/Notification/index.tsx";

const App = () => {
  // states
  const [patients, setPatients] = useState<Array<Patient>>([]);
  const [diagnoses, setDiagnoses] = useState<Array<DiagnosisWithoutLatin>>([]);
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);
  const [notification, setNotification] = useState<string>("");

  // timeoutId reference for setTimeout in Notification component
  const timeoutId = useRef<number | undefined>(-1);

  // event handler for Notification component
  const showNotification = (msg: string, duration = 3000) => {
    setNotification(msg);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = window.setTimeout(() => setNotification(""), duration);
  };

  // fetching data from the server when the App component is mounted
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const patients = await patientService.getAll();
        setPatients(patients);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.message);
          showNotification(error.message);
        }
      }
    };

    const fetchDiagnosesList = async () => {
      try {
        const diagnoses = await diagnosesService.getAllWithoutLatin();
        setDiagnoses(diagnoses);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.message);
          showNotification(error.message);
        }
      }
    };

    if (needsRefresh) {
      void fetchPatientList();
      void fetchDiagnosesList();
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  // for React router
  const match = useMatch("/patients/:id");

  return (
    <div className="App">
      <Notification message={notification} />
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route
            path="/patients/:id"
            element={
              <FullPatientInfo
                patientId={match?.params?.id}
                showNotification={showNotification}
                diagnoses={diagnoses}
              />
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
